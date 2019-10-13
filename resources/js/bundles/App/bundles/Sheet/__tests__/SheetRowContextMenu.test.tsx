//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux, waitForElement, within } from '@app/testing/library'
import { appStateFactory, IAppStateFactoryInput, getCellAndCellProps } from '@app/testing/mocks/appState'

import { Sheet, ISheetProps } from '@app/bundles/Sheet/Sheet'
import { SheetRowContextMenu, ISheetRowContextMenuProps } from '@app/bundles/ContextMenu/SheetRowContextMenu'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets,
  allSheetsFromDatabase
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const sheetRowId = sheet.visibleRows[0]

console.warn = jest.fn()

const sheetFromDatabase = allSheetsFromDatabase[sheetId]

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
// @ts-ignore
axiosMock.post.mockResolvedValue({ data: null })
// @ts-ignore
axiosMock.patch.mockResolvedValue({ data: null })

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const sheetProps: ISheetProps = {
  fileId: fileId,
  id: sheetId
}

const sheetRowContextMenuProps: ISheetRowContextMenuProps = {
  sheetId: sheetId,
  rowId: sheetRowId,
  closeContextMenu: jest.fn(),
  contextMenuLeft: 50,
  contextMenuTop: 100
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetRowContextMenu', () => {
  
  // The Autosizer from react-window relies on DOM properties that don't exist 
  // in JSDom. We need to replace those properties so it can properly calculate
  // the grid dimensions and render the children. This solution comes from here:
  // https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-447014986
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 240 }) // 10 rows
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 }) // 6 columns
  })

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  })
  
  it("renders without crashing", async () => {
    const { getByTestId } = renderWithRedux(<SheetRowContextMenu {...sheetRowContextMenuProps}/>)
    const SheetRowContextMenuContainer = getByTestId('SheetRowContextMenu')
    expect(SheetRowContextMenuContainer).toBeTruthy()
    expect(SheetRowContextMenuContainer).toHaveStyleRule('top', '100px')
    expect(SheetRowContextMenuContainer).toHaveStyleRule('left', '50px')
  })

  it("creates sheet rows above the current row", async () => {
    const { cell: R1C1Cell } = getCellAndCellProps({ row: 1, column: 1 })
    const { getAllByTestId, getByTestId, store } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetRowLeaders = await waitForElement(() => getAllByTestId('SheetRowLeader'))
    const R1SheetRowLeader = SheetRowLeaders[1]

    fireEvent.contextMenu(R1SheetRowLeader)

    const SheetRowContextMenuContainer = await waitForElement(() => getByTestId('SheetRowContextMenu'))
    const AddRowsAboveContextMenuItem = within(SheetRowContextMenuContainer).getByText('row above')
    fireEvent.click(AddRowsAboveContextMenuItem)

    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCellContainer'))
    const NewR1C1Cell = SheetCellContainers[0]
    expect(store.getState().sheet.allSheets[sheetId].visibleRows.length).toEqual(sheet.visibleRows.length + 1)
    expect(within(NewR1C1Cell).queryByText(R1C1Cell.value)).not.toBeTruthy()
    expect(axiosMock.post).toHaveBeenCalled()
  })

  it("creates sheet rows below the current row", async () => {
    const { cell: RLastCLastCell } = getCellAndCellProps({ row: sheet.visibleRows.length - 1, column: sheet.visibleColumns.length - 1 })
    const { getAllByTestId, getByTestId, store } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetRowLeaders = await waitForElement(() => getAllByTestId('SheetRowLeader'))
    const RLastSheetRowLeader = SheetRowLeaders[SheetRowLeaders.length - 1]

    fireEvent.contextMenu(RLastSheetRowLeader)

    const SheetRowContextMenuContainer = await waitForElement(() => getByTestId('SheetRowContextMenu'))
    const AddRowsBelowContextMenuItem = within(SheetRowContextMenuContainer).getByText('row below')
    fireEvent.click(AddRowsBelowContextMenuItem)

    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCellContainer'))
    const NewRLastCLastCell = SheetCellContainers[SheetCellContainers.length - 1]
    expect(store.getState().sheet.allSheets[sheetId].visibleRows.length).toEqual(sheet.visibleRows.length + 1)
    expect(within(NewRLastCLastCell).queryByText(RLastCLastCell.value)).not.toBeTruthy()
    expect(axiosMock.post).toHaveBeenCalled()
  })

})