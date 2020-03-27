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
import { selectSheetColumns, hideSheetColumns } from '@/state/sheet/actions'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetColumnContextMenuShowColumns, { ISheetColumnContextMenuShowColumnsProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuShowColumns'

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
const props: ISheetColumnContextMenuShowColumnsProps = {
  sheetId: sheetId,
  columnIndex: columnIndex,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuShowColumns', () => {

  beforeEach(() => {
    (axiosMock.patch as jest.Mock).mockResolvedValue({});
  })

  const sheetColumnContextMenuShowColumns = (appState: IAppState = mockAppState) => {
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
        <SheetColumnContextMenuShowColumns {...props} />
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const column1 = allSheetColumns[columnId]
    dispatch(selectSheetColumns(sheetId, columnId))
    dispatch(hideSheetColumns(sheetId))
    const showColumns = getByTestId("SheetColumnContextMenuShowColumns")
    fireEvent.mouseEnter(showColumns)
    const showColumn1 = getByText(column1.name)
    return {
      showColumn1,
      dispatch,
      getState,
      showColumns,
      queryByText
    }
  }

  it("displays an error message if a user with an expired subscription attempts to hide columns", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { showColumn1, queryByText } = sheetColumnContextMenuShowColumns(appState)
    showColumn1.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to hide columns", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { showColumn1, queryByText } = sheetColumnContextMenuShowColumns(appState)
    showColumn1.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("correctly shows 1 column", () => {
    const { getState, showColumn1 } = sheetColumnContextMenuShowColumns()
    const visibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(visibleColumns.length).toBe(activeSheetView.visibleColumns.length - 1)
    showColumn1.click()
    const nextVisibleColumns = getState().sheet.allSheetViews[activeSheetView.id].visibleColumns
    expect(nextVisibleColumns.length).toBe(activeSheetView.visibleColumns.length)
    expect(nextVisibleColumns.indexOf(columnId)).not.toBe(-1)
  })
  
})