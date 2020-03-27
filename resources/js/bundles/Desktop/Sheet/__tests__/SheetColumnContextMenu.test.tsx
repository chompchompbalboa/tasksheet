//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'

import { renderWithRedux } from '@/testing/library'
import { 
  createMockStore, 
  IMockAppStateFactoryInput,
  mockAppState,
  mockAppStateFactory
} from '@/testing/mocks'

import { IAppState } from '@/state'
import { hideSheetColumns, selectSheetColumns } from '@/state/sheet/actions'

import SheetColumnContextMenu, { ISheetColumnContextMenuProps } from '@desktop/Sheet/SheetColumnContextMenu'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets,
  allSheetViews
} = mockAppStateFactory({} as IMockAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const sheetColumnId = activeSheetView.visibleColumns[0]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuProps = {
  sheetId: sheetId,
  columnId: sheetColumnId,
  columnIndex: 0,
  closeContextMenu: jest.fn(),
  contextMenuLeft: 50,
  contextMenuTop: 100,
  contextMenuRight: null
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenu', () => {

  const sheetColumnContextMenu = (appState: IAppState = mockAppState) => {
    const {
      store: {
        dispatch
      },
      queryByTestId,
      queryByText
    } = renderWithRedux(<SheetColumnContextMenu {...props} />, { store: createMockStore(appState) })
    return {
      dispatch,
      queryByTestId,
      queryByText
    }
  }
  
  it("displays a menu item to insert new columns", () => {
    const { queryByTestId } = sheetColumnContextMenu()
    expect(queryByTestId("SheetColumnContextMenuInsertColumnsContainer")).toBeTruthy()
  })
  
  it("displays a menu item to delete columns", () => {
    const { queryByTestId } = sheetColumnContextMenu()
    expect(queryByTestId("SheetColumnContextMenuDeleteColumns")).toBeTruthy()
  })
  
  it("displays a menu item to move columns", () => {
    const { queryByTestId } = sheetColumnContextMenu()
    expect(queryByTestId("SheetColumnContextMenuMoveColumns")).toBeTruthy()
  })
  
  it("displays a menu item to hide columns", () => {
    const { queryByTestId } = sheetColumnContextMenu()
    expect(queryByTestId("SheetColumnContextMenuHideColumns")).toBeTruthy()
  })
  
  it("displays a menu item to show columns", () => {
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({})
    const { dispatch, queryByTestId } = sheetColumnContextMenu()
    dispatch(selectSheetColumns(sheetId, sheetColumnId))
    dispatch(hideSheetColumns(sheetId))
    expect(queryByTestId("SheetColumnContextMenuShowColumns")).toBeTruthy()
  })
  
  it("displays a menu item to rename the column", () => {
    const { queryByText } = sheetColumnContextMenu()
    expect(queryByText("Rename")).toBeTruthy()
  })

})