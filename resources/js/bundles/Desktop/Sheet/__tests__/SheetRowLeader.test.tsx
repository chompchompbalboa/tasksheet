//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux, waitForElement, within } from '@/testing/library'
import { appState as mockAppState, appStateFactory, appStateFactoryColumns, IAppStateFactoryInput, getCellAndCellProps } from '@/testing/mocks/appState'

import { ISheetCell } from '@/state/sheet/types'
import { Sheet, ISheetProps } from '@desktop/Sheet/Sheet'
import { SheetRowLeader, ISheetRowLeaderProps } from '@desktop/Sheet/SheetRowLeader'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
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

const sheetRowLeaderProps: ISheetRowLeaderProps = {
  sheetId: sheetId,
  rowId: sheet.rows[0],
  isRowBreak: false,
  style: {},
  text: 'Test SheetRowLeader'
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetRowLeader', () => {
  
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

  const sheetRowLeaderPropsText = sheetRowLeaderProps.text as string
  
  it("renders without crashing", async () => {
    const { getByText } = renderWithRedux(<SheetRowLeader {...sheetRowLeaderProps}/>)
    expect(getByText(sheetRowLeaderPropsText)).toBeTruthy()
  })
  
  it("opens the context menu on click", async () => {
    const { getAllByTestId, getByTestId } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetRowLeaders = await waitForElement(() => getAllByTestId('SheetRowLeader'))
    const R1SheetRowLeader = SheetRowLeaders[1]
    fireEvent.contextMenu(R1SheetRowLeader)
    const SheetRowContextMenu = await waitForElement(() => getByTestId('SheetRowContextMenu'))
    expect(SheetRowContextMenu).toBeTruthy()
  })
  
  it("selects the sheet row on click", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ row: 1, column: 1 })
    const { cell: R1CLastCell } = getCellAndCellProps({ row: 1, column: activeSheetView.visibleColumns.length })
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
    const R1CLastSheetCellSheetRange = getSheetRange(R1CLastCell)

    const SheetRowLeaders = await waitForElement(() => getAllByTestId('SheetRowLeader'))
    const R1SheetRowLeader = SheetRowLeaders[0]
    fireEvent.mouseDown(R1SheetRowLeader)

    expect(R1C1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(R1CLastSheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
  })
  
  it("selects the next sheet row if an entire row is selected and the user keyDowns an up or down arrow", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ row: 1, column: 1 })
    const { cell: R1CLastCell } = getCellAndCellProps({ row: 1, column: activeSheetView.visibleColumns.length })
    const { cell: R2C1Cell } = getCellAndCellProps({ row: 2, column: 1 })
    const { cell: R2CLastCell } = getCellAndCellProps({ row: 2, column: activeSheetView.visibleColumns.length })
    const { cell: R3C1Cell } = getCellAndCellProps({ row: 3, column: 1 })
    const { cell: R3CLastCell } = getCellAndCellProps({ row: 3, column: activeSheetView.visibleColumns.length })
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
    const R1CLastSheetCellSheetRange = getSheetRange(R1CLastCell)
    const R2C1SheetCellSheetRange = getSheetRange(R2C1Cell)
    const R2CLastSheetCellSheetRange = getSheetRange(R2CLastCell)
    const R3C1SheetCellSheetRange = getSheetRange(R3C1Cell)
    const R3CLastSheetCellSheetRange = getSheetRange(R3CLastCell)

    const SheetRowLeaders = await waitForElement(() => getAllByTestId('SheetRowLeader'))
    const R2SheetRowLeader = SheetRowLeaders[1]
    fireEvent.mouseDown(R2SheetRowLeader)
    expect(R2C1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(R2CLastSheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    fireEvent.keyDown(getByTestId('SheetContainer'), { key: 'ArrowUp' })
    expect(R1C1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(R1CLastSheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    fireEvent.keyDown(getByTestId('SheetContainer'), { key: 'ArrowDown' })
    fireEvent.keyDown(getByTestId('SheetContainer'), { key: 'ArrowDown' })
    expect(R3C1SheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(R3CLastSheetCellSheetRange).toHaveStyleRule('background-color', userColorSecondary)
  })

})