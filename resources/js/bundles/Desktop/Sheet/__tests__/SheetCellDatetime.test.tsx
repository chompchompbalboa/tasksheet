//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { cleanup, fireEvent, renderWithRedux, waitForElement, within } from '@/testing/library'
import { 
  createMockStore,
  mockAppState,
  mockAppStateColumnTypes
} from '@/testing/mocks'
import {
  appStateFactory,
  appStateFactoryColumns,
  IAppStateFactoryInput,
  getCellAndCellProps
} from '@/testing/mocks/appState'

import { Sheet, ISheetProps } from '@desktop/Sheet/Sheet'
import { SheetCellDatetime, ISheetCellDatetimeProps } from '@desktop/Sheet/SheetCellDatetime'
import { ISheetCell } from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  allSheetsFromDatabase
} = appStateFactory({} as IAppStateFactoryInput)

const {
  folder: {
    folders,
    files
  },
  sheet: {
    allSheets,
    allSheetRows,
    allSheetCells,
    allSheetViews
  }
} = mockAppState

const datetimeColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'DATETIME')

const folderId = Object.keys(folders)[0]
const fileId = folders[folderId].files[0]
const file = files[fileId]
const sheetId = file.typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const sheetRowId = sheet.visibleRows[0]
const sheetColumnId = activeSheetView.visibleColumns[datetimeColumnIndex]
const sheetCellId = allSheetRows[sheetRowId].cells[sheetColumnId]
const sheetCell = allSheetCells[sheetCellId]

const sheetFromDatabase = allSheetsFromDatabase[sheetId]

const testDate = '08/10/1988'

console.warn = jest.fn()

afterEach(cleanup)

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
// @ts-ignore
axiosMock.patch.mockResolvedValue({ data: null })

jest.setTimeout(10000)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const sheetProps: ISheetProps = {
  fileId: fileId,
  id: sheetId
}

const sheetCellDatetimeProps: ISheetCellDatetimeProps = {
  sheetId: sheetId,
  cellId: sheetCellId,
  cell: sheetCell,
  isCellInRange: false,
  isCellSelected: false,
  updateCellValue: jest.fn(),
  value: sheetCell.value
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetCellDatetime', () => {
  
  // The Autosizer from react-window relies on DOM properties that don't exist 
  // in JSDom. We need to replace those properties so it can properly calculate
  // the grid dimensions and render the children. This solution comes from here:
  // https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-447014986
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 240 }) // 10 rows
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: appStateFactoryColumns.length * 100 })
  })

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  })
  
  it("renders without crashing", async () => {
    const { getByTestId } = renderWithRedux(<SheetCellDatetime {...sheetCellDatetimeProps}/>, { store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellDatetime')).toHaveTextContent(sheetCell.value)
  })

  it("opens the datepicker when the user is editing", async () => {
    const { cell: R1CDatetimeCell } = getCellAndCellProps({ row: 1, column: datetimeColumnIndex + 1 })
    const { getAllByTestId, getByTestId } = renderWithRedux(<Sheet {...sheetProps}/>, { store: createMockStore(mockAppState) })
    const SheetCellDatetimes = await waitForElement(() => getAllByTestId('SheetCellDatetime'))

    const getSheetCellDatetime = (cell: ISheetCell) => {
      return SheetCellDatetimes.find(SheetCellDatetime => {
        const { queryByText } = within(SheetCellDatetime)
        return queryByText(cell.value)
      })
    }
    const SheetCellDatetime = getSheetCellDatetime(R1CDatetimeCell)
    expect(SheetCellDatetime).toBeTruthy()

    fireEvent.doubleClick(SheetCellDatetime)

    const SheetCellDatetimeDatepicker = await waitForElement(() => getByTestId('SheetCellDatetimeDatepicker'))
    expect(SheetCellDatetimeDatepicker).toBeTruthy()
  })


  it("updates its value on user input", async () => {
    const { cell: R1CDatetimeCell } = getCellAndCellProps({ row: 1, column: datetimeColumnIndex + 1 })
    const { getAllByTestId, getByTestId } = renderWithRedux(<Sheet {...sheetProps}/>, { store: createMockStore(mockAppState) })
    const SheetCellDatetimes = await waitForElement(() => getAllByTestId('SheetCellDatetime'))

    const getSheetCellDatetime = (cell: ISheetCell) => {
      return SheetCellDatetimes.find(SheetCellDatetime => {
        const { queryByText } = within(SheetCellDatetime)
        return queryByText(cell.value)
      })
    }
    const SheetCellDatetime = getSheetCellDatetime(R1CDatetimeCell)
    expect(SheetCellDatetime).toBeTruthy()

    fireEvent.mouseDown(SheetCellDatetime)
    fireEvent.keyDown(SheetCellDatetime, { key: testDate[0] })
    expect(SheetCellDatetime).toContainHTML(testDate[0])

    const SheetCellDatetimeDatepickerInput = await waitForElement(() => getByTestId('SheetCellDatetimeDatepickerInput'))
    fireEvent.change(SheetCellDatetimeDatepickerInput, { target: { value: testDate } })
    expect(SheetCellDatetimeDatepickerInput).toContainHTML(testDate)
  })

  it("formats the date after editing is complete", async () => {
    const { cell: R1CDatetimeCell } = getCellAndCellProps({ row: 1, column: datetimeColumnIndex + 1 })
    const { getAllByTestId, getByTestId } = renderWithRedux(<Sheet {...sheetProps}/>, { store: createMockStore(mockAppState) })
    const SheetCellDatetimes = await waitForElement(() => getAllByTestId('SheetCellDatetime'))

    const getSheetCellDatetime = (cell: ISheetCell) => {
      return SheetCellDatetimes.find(SheetCellDatetime => {
        const { queryByText } = within(SheetCellDatetime)
        return queryByText(cell.value)
      })
    }
    const SheetCellDatetime = getSheetCellDatetime(R1CDatetimeCell)
    expect(SheetCellDatetime).toBeTruthy()

    fireEvent.doubleClick(SheetCellDatetime)

    const SheetCellDatetimeDatepickerInput = await waitForElement(() => getByTestId('SheetCellDatetimeDatepickerInput'))
    fireEvent.change(SheetCellDatetimeDatepickerInput, { target: { value: '1/1/10' } })
    expect(SheetCellDatetimeDatepickerInput).toHaveValue('1/1/10')

    fireEvent.keyDown(SheetCellDatetime, { key: 'Enter' })
    expect(SheetCellDatetime).toContainHTML('01/01/2010')
  })
  
  it("changes the visible month in the datepicker", async () => {
    const currentDate = moment()
    const { cell: R1CDatetimeCell } = getCellAndCellProps({ row: 1, column: datetimeColumnIndex + 1 })
    const { getAllByTestId, getByTestId, getByText } = renderWithRedux(<Sheet {...sheetProps}/>, { store: createMockStore(mockAppState) })
    const SheetCellDatetimes = await waitForElement(() => getAllByTestId('SheetCellDatetime'))

    const getSheetCellDatetime = (cell: ISheetCell) => {
      return SheetCellDatetimes.find(SheetCellDatetime => {
        const { queryByText } = within(SheetCellDatetime)
        return queryByText(cell.value)
      })
    }
    const SheetCellDatetime = getSheetCellDatetime(R1CDatetimeCell)
    expect(SheetCellDatetime).toBeTruthy()
    fireEvent.doubleClick(SheetCellDatetime)

    const GoToPreviousMonth = await waitForElement(() => getByTestId('SheetCellDatetimeDatepickerGoToPreviousMonth'))
    const GoToNextMonth = await waitForElement(() => getByTestId('SheetCellDatetimeDatepickerGoToNextMonth'))
    const CurrentMonth = await waitForElement(() => getByText(currentDate.format('MMMM YYYY')))
    expect(GoToPreviousMonth).toBeTruthy()
    expect(GoToNextMonth).toBeTruthy()
    expect(CurrentMonth).toBeTruthy()
    
    fireEvent.click(GoToPreviousMonth)
    expect(CurrentMonth).toContainHTML(moment(currentDate).subtract(1, 'month').format('MMMM YYYY'))
    fireEvent.click(GoToNextMonth)
    expect(CurrentMonth).toContainHTML(moment(currentDate).format('MMMM YYYY'))
    fireEvent.click(GoToNextMonth)
    expect(CurrentMonth).toContainHTML(moment(currentDate).add(1, 'month').format('MMMM YYYY'))
    fireEvent.click(GoToPreviousMonth)
    expect(CurrentMonth).toContainHTML(moment(currentDate).format('MMMM YYYY'))
  })
  
  it("changes the input value from the datepicker", async () => {
    const currentDate = moment()
    const { cell: R1CDatetimeCell } = getCellAndCellProps({ row: 1, column: datetimeColumnIndex + 1 })
    const { getAllByTestId, getByTestId } = renderWithRedux(<Sheet {...sheetProps}/>, { store: createMockStore(mockAppState) })
    const SheetCellDatetimes = await waitForElement(() => getAllByTestId('SheetCellDatetime'))

    const getSheetCellDatetime = (cell: ISheetCell) => {
      return SheetCellDatetimes.find(SheetCellDatetime => {
        const { queryByText } = within(SheetCellDatetime)
        return queryByText(cell.value)
      })
    }
    const SheetCellDatetime = getSheetCellDatetime(R1CDatetimeCell)
    expect(SheetCellDatetime).toBeTruthy()
    fireEvent.doubleClick(SheetCellDatetime)

    const DatepickerDates = await waitForElement(() => getByTestId('SheetCellDatetimeDatepickerDates'))
    const SheetCellDatetimeDatepickerInput = await waitForElement(() => getByTestId('SheetCellDatetimeDatepickerInput'))
    expect(DatepickerDates).toBeTruthy()
    expect(SheetCellDatetimeDatepickerInput).toBeTruthy()

    const First = await waitForElement(() => within(DatepickerDates).getByText('1'))
    const Thirteenth = await waitForElement(() => within(DatepickerDates).getByText('13'))
    const Twentieth = await waitForElement(() => within(DatepickerDates).getByText('20'))
    
    fireEvent.click(First)
    expect(SheetCellDatetimeDatepickerInput).toHaveValue(moment(currentDate).date(1).format('MM/DD/YYYY'))
    fireEvent.click(Thirteenth)
    expect(SheetCellDatetimeDatepickerInput).toHaveValue(moment(currentDate).date(13).format('MM/DD/YYYY'))
    fireEvent.click(Twentieth)
    expect(SheetCellDatetimeDatepickerInput).toHaveValue(moment(currentDate).date(20).format('MM/DD/YYYY'))
  })

})
