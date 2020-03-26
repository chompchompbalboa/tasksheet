//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import {
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
import SheetColumnContextMenuHideColumns, { ISheetColumnContextMenuHideColumnsProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuHideColumns'

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
const columnIndex = 1
const columnId = activeSheetView.visibleColumns[columnIndex]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetColumnContextMenuHideColumnsProps = {
  sheetId: sheetId,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuHideColumns', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenuHideColumns = (appState: IAppState = mockAppState) => {
    const {
      getByTestId,
      store: {
        dispatch,
        getState
      },
      queryByText
    } = renderWithRedux(
      <>
        <SheetColumnContextMenuHideColumns {...props} />
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const hideColumns = getByTestId("SheetColumnContextMenuHideColumns")
    return {
      dispatch,
      getState,
      hideColumns,
      queryByText
    }
  }

  it("displays an error message if a user with an expired subscription attempts to hide columns", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { hideColumns, queryByText } = sheetColumnContextMenuHideColumns(appState)
    hideColumns.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to hide columns", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { hideColumns, queryByText } = sheetColumnContextMenuHideColumns(appState)
    hideColumns.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("correctly hides 1 column", () => {
    const { dispatch, getState, hideColumns } = sheetColumnContextMenuHideColumns()
    const visibleColumns = activeSheetView.visibleColumns
    dispatch(selectSheetColumns(sheetId, columnId))
    hideColumns.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.length).toBe(visibleColumns.length - 1)
    expect(nextVisibleColumns.indexOf(columnId)).toBe(-1)
  })

  it("correctly hides 3 columns", () => {
    const { dispatch, getState, hideColumns } = sheetColumnContextMenuHideColumns()
    const visibleColumns = activeSheetView.visibleColumns
    const columnId1 = visibleColumns[4]
    const columnId2 = visibleColumns[5]
    const columnId3 = visibleColumns[6]
    dispatch(selectSheetColumns(sheetId, columnId1, columnId3))
    hideColumns.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.length).toBe(visibleColumns.length - 3)
    expect(nextVisibleColumns.indexOf(columnId1)).toBe(-1)
    expect(nextVisibleColumns.indexOf(columnId2)).toBe(-1)
    expect(nextVisibleColumns.indexOf(columnId3)).toBe(-1)
  })
  
})