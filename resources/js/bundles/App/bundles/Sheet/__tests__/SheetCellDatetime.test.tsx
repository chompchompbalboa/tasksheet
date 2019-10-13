//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { cleanup, fireEvent, renderWithRedux, waitForElement, within } from '@app/testing/library'
import { 
  createMockStore,
  mockAppState,
  mockAppStateColumnTypes
} from '@app/testing/mocks'
import {
  appStateFactory,
  appStateFactoryColumns,
  IAppStateFactoryInput,
  getCellAndCellProps
} from '@app/testing/mocks/appState'

import { Sheet, ISheetProps } from '@app/bundles/Sheet/Sheet'
import { SheetCellDatetime, ISheetCellDatetimeProps } from '@app/bundles/Sheet/SheetCellDatetime'
import { ISheetCell } from '@/bundles/App/state/sheet/types'

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
    allSheetColumnTypes
  }
} = mockAppState

const datetimeColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'DATETIME')

const folderId = Object.keys(folders)[0]
const fileId = folders[folderId].files[0]
const file = files[fileId]
const sheetId = file.typeId
const sheet = allSheets[sheetId]
const sheetRowId = sheet.visibleRows[0]
const sheetColumnId = sheet.visibleColumns[datetimeColumnIndex]
const sheetCellId = allSheetRows[sheetRowId].cells[sheetColumnId]
const sheetCell = allSheetCells[sheetCellId]
const sheetCellColumnType = allSheetColumnTypes['DATETIME']

const sheetFromDatabase = allSheetsFromDatabase[sheetId]

const testDate = '08/10/1988'

console.warn = jest.fn()

afterEach(cleanup)

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
// @ts-ignore
axiosMock.patch.mockResolvedValue({ data: null })

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
  columnType: sheetCellColumnType,
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

    const SheetCellDatetimeTextarea = await waitForElement(() => getByTestId('SheetCellStringTextarea'))
    fireEvent.change(SheetCellDatetimeTextarea, { target: { value: testDate } })
    expect(SheetCellDatetimeTextarea).toContainHTML(testDate)
  })

  it("updates the date format the cell is displayed in", async () => {
    const { cell: R1CDatetimeCell } = getCellAndCellProps({ row: 1, column: datetimeColumnIndex + 1 })
    const { getAllByTestId, getByTestId, queryByText } = renderWithRedux(<Sheet {...sheetProps}/>, { store: createMockStore(mockAppState) })
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
    fireEvent.keyDown(SheetCellDatetime, { key: '1' })
    expect(SheetCellDatetime).toContainHTML('1')

    const SheetCellDatetimeTextarea = await waitForElement(() => getByTestId('SheetCellStringTextarea'))
    fireEvent.change(SheetCellDatetimeTextarea, { target: { value: '1/1/10' } })
    expect(SheetCellDatetimeTextarea).toContainHTML('1/1/10')

    const UpdatedSheetCellDatetime = await waitForElement(() => queryByText('01/01/2010'))
    expect(UpdatedSheetCellDatetime).toBeTruthy()
  })



})
