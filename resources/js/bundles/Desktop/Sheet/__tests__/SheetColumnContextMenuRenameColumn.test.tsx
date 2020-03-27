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

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetColumnContextMenuRenameColumn, { ISheetColumnContextMenuRenameColumnProps } from '@/bundles/Desktop/Sheet/SheetColumnContextMenuRenameColumn'
import SheetHeader, { ISheetHeaderProps } from '@desktop/Sheet/SheetHeader'

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
const props: ISheetColumnContextMenuRenameColumnProps = {
  sheetId: sheetId,
  columnId: columnId,
  closeContextMenu: jest.fn(),
}

const sheetHeaderProps: ISheetHeaderProps = {
  sheetId: sheetId,
  columnId: columnId,
  gridContainerRef: null,
  handleContextMenu: null,
  isLast: false,
  isNextColumnAColumnBreak: false,
  visibleColumnsIndex: columnIndex
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuRenameColumn', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenuRenameColumn = (appState: IAppState = mockAppState) => {
    const {
      getByTestId,
      store: {
        dispatch,
        getState
      },
      queryByTestId,
      queryByText
    } = renderWithRedux(
      <>
        <SheetColumnContextMenuRenameColumn {...props} />
        <SheetHeader {...sheetHeaderProps}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const renameColumn = getByTestId("SheetColumnContextMenuRenameColumn")
    return {
      dispatch,
      getState,
      renameColumn,
      queryByTestId,
      queryByText
    }
  }

  it("displays an error message if a user with an expired subscription attempts to hide columns", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { renameColumn, queryByText } = sheetColumnContextMenuRenameColumn(appState)
    renameColumn.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to hide columns", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { renameColumn, queryByText } = sheetColumnContextMenuRenameColumn(appState)
    renameColumn.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("correctly displays the column renaming input in SheetRowHeader when clicked", () => {
    const { renameColumn, queryByTestId } = sheetColumnContextMenuRenameColumn()
    expect(queryByTestId("SheetHeaderNameContainer")).toBeTruthy()
    expect(queryByTestId("SheetHeaderNameInput")).not.toBeTruthy()
    renameColumn.click()
    expect(queryByTestId("SheetHeaderNameContainer")).not.toBeTruthy()
    expect(queryByTestId("SheetHeaderNameInput")).toBeTruthy()
  })
  
})