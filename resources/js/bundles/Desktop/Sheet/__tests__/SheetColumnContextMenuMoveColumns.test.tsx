//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import { 
  fireEvent,
  renderWithRedux,
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
import SheetColumnContextMenuMoveColumns, { ISheetColumnContextMenuMoveColumnsProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuMoveColumns'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets,
  allSheetColumns,
  allSheetViews
} = mockAppStateFactory({} as IMockAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const columnIndex = 1
const columnId = activeSheetView.visibleColumns[columnIndex]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuMoveColumnsProps = {
  sheetId: sheetId,
  columnId: columnId,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuMoveColumns', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenuMoveColumns = (appState: IAppState = mockAppState) => {
    const {
      getByTestId,
      getByText,
      store: {
        dispatch,
        getState
      },
      queryByText
    } = renderWithRedux(
      <>
        <SheetColumnContextMenuMoveColumns {...props} />
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const moveColumns = getByTestId("SheetColumnContextMenuMoveColumns")
    fireEvent.mouseEnter(moveColumns)
    const column1 = allSheetColumns[activeSheetView.visibleColumns[0]]
    const column2 = allSheetColumns[activeSheetView.visibleColumns[1]]
    const column3 = allSheetColumns[activeSheetView.visibleColumns[2]]
    const column4 = allSheetColumns[activeSheetView.visibleColumns[3]]
    const column1MoveTo = getByText(column1.name)
    const column2MoveTo = getByText(column2.name)
    const column3MoveTo = getByText(column3.name)
    const column4MoveTo = getByText(column4.name)
    return {
      column1,
      column1MoveTo,
      column2MoveTo,
      column3,
      column3MoveTo,
      column4,
      column4MoveTo,
      dispatch,
      getState,
      moveColumns,
      queryByText
    }
  }

  it("displays an error message if a user with an expired subscription attempts to insert new colums", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { column1MoveTo, queryByText } = sheetColumnContextMenuMoveColumns(appState)
    column1MoveTo.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to insert new colums", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { column1MoveTo, queryByText } = sheetColumnContextMenuMoveColumns(appState)
    column1MoveTo.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("correctly moves a single column", () => {
    const { column4MoveTo, getState } = sheetColumnContextMenuMoveColumns()
    column4MoveTo.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.indexOf(columnId)).toBe(2)
  })

  it("correctly moves multiple columns", () => {
    const { column2MoveTo, column3, column4, dispatch, getState } = sheetColumnContextMenuMoveColumns()
    dispatch(selectSheetColumns(sheetId, column3.id, column4.id))
    column2MoveTo.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.indexOf(column3.name)).toBe(2)
    expect(nextVisibleColumns.indexOf(column4.name)).toBe(3)
  })
  
})