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
import SheetColumnContextMenuInsertColumnBreak, { ISheetColumnContextMenuInsertColumnBreakProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuInsertColumnBreak'

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

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuInsertColumnBreakProps = {
  sheetId: sheetId,
  columnIndex: 0,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuInsertColumnBreak', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenuInsertColumnBreak = (appState: IAppState = mockAppState, columnIndex: number = 0) => {
    const {
      getByTestId,
      store: {
        dispatch,
        getState
      },
      queryByText
    } = renderWithRedux(
      <>
        <SheetColumnContextMenuInsertColumnBreak
          {...props} 
          columnIndex={columnIndex}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const insertColumnBreak = getByTestId("SheetColumnContextMenuInsertColumnBreak")
    return {
      dispatch,
      getState,
      insertColumnBreak,
      queryByText
    }
  }

  it("displays an error message if a user with an expired subscription attempts to insert new colums", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { insertColumnBreak, queryByText } = sheetColumnContextMenuInsertColumnBreak(appState)
    insertColumnBreak.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to insert a column break", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { insertColumnBreak, queryByText } = sheetColumnContextMenuInsertColumnBreak(appState)
    insertColumnBreak.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("correctly inserts a column break when a single column is selected", () => {
    const { insertColumnBreak, getState } = sheetColumnContextMenuInsertColumnBreak()
    const visibleColumns = activeSheetView.visibleColumns
    insertColumnBreak.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.length).toBe(visibleColumns.length + 1)
    expect(nextVisibleColumns[0]).toBe('COLUMN_BREAK')
  })

  it("correctly inserts a column break when multiple columns are selected", () => {
    const { insertColumnBreak, dispatch, getState } = sheetColumnContextMenuInsertColumnBreak(mockAppState, 3)
    const visibleColumns = activeSheetView.visibleColumns
    const columnId1 = visibleColumns[1]
    const columnId2 = visibleColumns[3]
    dispatch(selectSheetColumns(sheetId, columnId1, columnId2))
    insertColumnBreak.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.length).toBe(visibleColumns.length + 1)
    expect(nextVisibleColumns[1]).toBe('COLUMN_BREAK')
  })
  
})