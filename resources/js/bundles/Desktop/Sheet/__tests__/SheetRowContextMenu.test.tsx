//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import { fireEvent, renderWithRedux, waitForElement, within } from '@/testing/library'
import { appStateFactory, IAppStateFactoryInput, getCellAndCellProps } from '@/testing/mocks/appState'

import { Sheet, ISheetProps } from '@desktop/Sheet/Sheet'
import { SheetRowContextMenu, ISheetRowContextMenuProps } from '@desktop/Sheet/SheetRowContextMenu'

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

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const sheetRowId = sheet.visibleRows[0]

console.warn = jest.fn()

const sheetFromDatabase = allSheetsFromDatabase[sheetId]

// @ts-ignore
axiosMock.get.mockResolvedValue({ data: sheetFromDatabase })
// @ts-ignore
axiosMock.post.mockResolvedValue({ data: null })
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
    const R1SheetRowLeader = SheetRowLeaders[0]

    fireEvent.contextMenu(R1SheetRowLeader)

    const SheetRowContextMenuContainer = await waitForElement(() => getByTestId('SheetRowContextMenu'))
    const AddRowsAboveContextMenuItem = within(SheetRowContextMenuContainer).getByText('row above')
    fireEvent.click(AddRowsAboveContextMenuItem)

    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCell'))
    const NewR1C1Cell = SheetCellContainers[0]
    expect(store.getState().sheet.allSheets[sheetId].visibleRows.length).toEqual(sheet.visibleRows.length + 1)
    expect(within(NewR1C1Cell).queryByText(R1C1Cell.value)).not.toBeTruthy()
    expect(axiosMock.post).toHaveBeenCalled()
  })

  it("creates sheet rows below the current row", async () => {
    const { cell: RLastCLastCell } = getCellAndCellProps({ row: sheet.visibleRows.length - 2, column: activeSheetView.visibleColumns.length - 1 })
    const { getAllByTestId, getByTestId, store } = renderWithRedux(<Sheet {...sheetProps}/>)
    const SheetRowLeaders = await waitForElement(() => getAllByTestId('SheetRowLeader'))
    const RLastSheetRowLeader = SheetRowLeaders[SheetRowLeaders.length - 2]

    fireEvent.contextMenu(RLastSheetRowLeader)

    const SheetRowContextMenuContainer = await waitForElement(() => getByTestId('SheetRowContextMenu'))
    const AddRowsBelowContextMenuItem = within(SheetRowContextMenuContainer).getByText('row below')
    fireEvent.click(AddRowsBelowContextMenuItem)

    const SheetCellContainers = await waitForElement(() => getAllByTestId('SheetCell'))
    const NewRLastCLastCell = SheetCellContainers[SheetCellContainers.length - 1]
    expect(store.getState().sheet.allSheets[sheetId].visibleRows.length).toEqual(sheet.visibleRows.length + 1)
    expect(within(NewRLastCLastCell).queryByText(RLastCLastCell.value)).not.toBeTruthy()
    expect(axiosMock.post).toHaveBeenCalled()
  })

})