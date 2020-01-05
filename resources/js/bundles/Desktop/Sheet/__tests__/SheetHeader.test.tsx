//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux, waitForElement, within } from '@/testing/library'
import { appState as mockAppState, appStateFactory, IAppStateFactoryInput, getCellAndCellProps } from '@/testing/mocks/appState'

import { ISheetCell } from '@/state/sheet/types'
import { Sheet, ISheetProps } from '@desktop/Sheet/Sheet'
import { SheetHeader, ISheetHeaderProps } from '@desktop/Sheet/SheetHeader'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheetColumns,
  allSheets,
  allSheetsFromDatabase,
  allSheetViews
} = appStateFactory({} as IAppStateFactoryInput)

const {
  user: {
    color: {
      secondary: userColorSecondary
    }
  }
} = mockAppState

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const column = allSheetColumns[activeSheetView.visibleColumns[0]]

console.warn = jest.fn()
console.error = jest.fn()

const sheetFromDatabase = allSheetsFromDatabase[sheetId]

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

const sheetHeaderProps: ISheetHeaderProps = {
  sheetId: sheetId,
  columnId: column.id,
  gridContainerRef: null,
  handleContextMenu: jest.fn(),
  isLast: false,
  isNextColumnAColumnBreak: false,
  visibleColumnsIndex: 0
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetHeader', () => {

  // JSDom returns 0 for all getBoundingClientRect values (since its not actually
  // rendering anything). SheetWindow relies on the width and height property to
  // calculate the sheet size, so we need to mock those vaulues in.
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', { writable: true, value: () => ({
      width: 1024,
      height: 768
    }) })
  })
  
  it("renders without crashing", async () => {
    const { getByText } = renderWithRedux(<SheetHeader {...sheetHeaderProps}/>)
    expect(getByText(column.name as string)).toBeTruthy()
  })
  
  it("opens the context menu on click", async () => {
    const { getAllByTestId, getByTestId } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetHeaders = await waitForElement(() => getAllByTestId('SheetHeader'))
    const C1SheetHeader = SheetHeaders[1]
    fireEvent.contextMenu(C1SheetHeader)
    const SheetColumnContextMenu = await waitForElement(() => getByTestId('SheetColumnContextMenu'))
    expect(SheetColumnContextMenu).toBeTruthy()
  })
  
  it("selects the sheet column on click", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ row: 1, column: 1 })
    const { cell: RLastC1Cell } = getCellAndCellProps({ row: sheet.visibleRows.length - 1, column: 1 })
    const { getAllByTestId } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCellContainer'))

    const getSheetRange = (cell: ISheetCell) => {
      const SheetCellContainer = SheetCellContainers.find(SheetCellContainer => {
        const { queryByText } = within(SheetCellContainer)
        return queryByText(cell.value)
      })
      return within(SheetCellContainer).getByTestId('SheetCellSheetRange')
    }
    const R1C1SheetCellSheetRange = getSheetRange(R1C1Cell)
    const RLastC1SheetCellSheetRange = getSheetRange(RLastC1Cell)

    const SheetHeaderNameContainers = await waitForElement(() => getAllByTestId('SheetHeaderNameContainer'))
    const R1SheetHeaderNameContainer = SheetHeaderNameContainers[0]
    fireEvent.mouseDown(R1SheetHeaderNameContainer)

    expect(R1C1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(RLastC1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
  })
  
  it("selects the next sheet column if an entire column is selected and the user keyDowns a right or left arrow", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ row: 1, column: 1 })
    const { cell: RLastC1Cell } = getCellAndCellProps({ row: sheet.visibleRows.length - 1, column: 1 })
    const { cell: R1C2Cell } = getCellAndCellProps({ row: 1, column: 2 })
    const { cell: RLastC2Cell } = getCellAndCellProps({ row: sheet.visibleRows.length - 1, column: 2 })
    const { cell: R1C3Cell } = getCellAndCellProps({ row: 1, column: 3 })
    const { cell: RLastC3Cell } = getCellAndCellProps({ row: sheet.visibleRows.length - 1, column: 3 })
    const { getByTestId, getAllByTestId } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCellContainer'))

    const getSheetRange = (cell: ISheetCell) => {
      const SheetCellContainer = SheetCellContainers.find(SheetCellContainer => {
        const { queryByText } = within(SheetCellContainer)
        return queryByText(cell.value)
      })
      return within(SheetCellContainer).getByTestId('SheetCellSheetRange')
    }
    const R1C1SheetCellSheetRange = getSheetRange(R1C1Cell)
    const RLastC1SheetCellSheetRange = getSheetRange(RLastC1Cell)
    const R1C2SheetCellSheetRange = getSheetRange(R1C2Cell)
    const RLastC2SheetCellSheetRange = getSheetRange(RLastC2Cell)
    const R1C3SheetCellSheetRange = getSheetRange(R1C3Cell)
    const RLastC3SheetCellSheetRange = getSheetRange(RLastC3Cell)

    const SheetHeaderNameContainers = await waitForElement(() => getAllByTestId('SheetHeaderNameContainer'))
    const C2SheetHeaderNameContainer = SheetHeaderNameContainers[1]
    fireEvent.mouseDown(C2SheetHeaderNameContainer)
    expect(R1C2SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(RLastC2SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    fireEvent.keyDown(getByTestId('SheetContainer'), { key: 'ArrowLeft' })
    expect(R1C1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(RLastC1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    fireEvent.keyDown(getByTestId('SheetContainer'), { key: 'ArrowRight' })
    fireEvent.keyDown(getByTestId('SheetContainer'), { key: 'ArrowRight' })
    expect(R1C3SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(RLastC3SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
  })

})