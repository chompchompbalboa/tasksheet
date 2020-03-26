//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import { 
  renderWithRedux 
} from '@/testing/library'
import { 
  createMockStore, 
  getMockAppStateByTasksheetSubscriptionType,
  getMockAppStateByUsersFilePermissionRole,
  IMockAppStateFactoryInput,
  mockAppState,
  mockAppStateFactory
} from '@/testing/mocks'

import { IAppState } from '@/state'
import { selectSheetColumns } from '@/state/sheet/actions'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetColumnContextMenuDeleteColumns, { ISheetColumnContextMenuDeleteColumnsProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuDeleteColumns'

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
const columnIndex = 0
const columnId = activeSheetView.visibleColumns[columnIndex]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuDeleteColumnsProps = {
  sheetId: sheetId,
  columnId: columnId,
  columnIndex: columnIndex,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuDeleteColumns', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenuDeleteColumns = (appState: IAppState = mockAppState) => {
    const {
      getByTestId,
      store: {
        dispatch,
        getState
      },
      queryByText
    } = renderWithRedux(
      <>
        <SheetColumnContextMenuDeleteColumns {...props} />
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const deleteColumnsContextMenuItem = getByTestId("SheetColumnContextMenuDeleteColumns")
    return {
      dispatch,
      getState,
      deleteColumnsContextMenuItem,
      queryByText
    }
  }

  it("displays an error message if a user with an expired subscription attempts to insert new colums", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { deleteColumnsContextMenuItem, queryByText } = sheetColumnContextMenuDeleteColumns(appState)
    deleteColumnsContextMenuItem.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to insert new colums", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { deleteColumnsContextMenuItem, queryByText } = sheetColumnContextMenuDeleteColumns(appState)
    deleteColumnsContextMenuItem.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("correctly deletes 1 column", () => {
    const { deleteColumnsContextMenuItem, dispatch, getState } = sheetColumnContextMenuDeleteColumns()
    const visibleColumnsCount = activeSheetView.visibleColumns.length
    dispatch(selectSheetColumns(sheetId, columnId))
    deleteColumnsContextMenuItem.click()
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.length).toBe(visibleColumnsCount - 1)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(columnId)).toBe(-1)
  })

  it("correctly deletes 3 column", () => {
    const { deleteColumnsContextMenuItem, dispatch, getState } = sheetColumnContextMenuDeleteColumns()
    const visibleColumnsCount = activeSheetView.visibleColumns.length
    const deletedColumnId1 = columnId
    const deletedColumnId2 = activeSheetView.visibleColumns[columnIndex + 1]
    const deletedColumnId3 = activeSheetView.visibleColumns[columnIndex + 2]
    dispatch(selectSheetColumns(sheetId, deletedColumnId1, deletedColumnId3))
    deleteColumnsContextMenuItem.click()
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.length).toBe(visibleColumnsCount - 3)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(deletedColumnId1)).toBe(-1)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(deletedColumnId2)).toBe(-1)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(deletedColumnId3)).toBe(-1)
  })
  
})