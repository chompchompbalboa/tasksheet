//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import { 
  fireEvent,
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

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetColumnContextMenuInsertColumns, { ISheetColumnContextMenuInsertColumnsProps } from '@desktop/Sheet/SheetColumnContextMenuInsertColumns'

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
const props: ISheetColumnContextMenuInsertColumnsProps = {
  sheetId: sheetId,
  columnIndex: columnIndex,
  closeContextMenu: jest.fn(),
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetColumnContextMenuInsertColumn', () => {

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({});
    (axiosMock.patch as jest.Mock).mockResolvedValueOnce({});
  })

  const sheetColumnContextMenuInsertColumns = (appState: IAppState = mockAppState) => {
    const {
      getByPlaceholderText,
      getByText,
      store: {
        getState
      },
      queryByText
    } = renderWithRedux(
      <>
        <SheetColumnContextMenuInsertColumns {...props} />
        <Messenger />
      </>, { store: createMockStore(appState) })
    const insertColumnText = getByText("Insert")
    const insertColumnInput = getByPlaceholderText("1") as HTMLInputElement
    return {
      getState,
      insertColumnInput,
      insertColumnText,
      queryByText
    }
  }
  
  it("displays a menu item with an input to insert columns before the current column", () => {
    const { insertColumnInput, insertColumnText } = sheetColumnContextMenuInsertColumns()
    expect(insertColumnInput).toBeTruthy()
    expect(insertColumnText).toBeTruthy()
  })
  
  it("correctly updates the input value", () => {
    const { insertColumnInput } = sheetColumnContextMenuInsertColumns()
    const nextInputValue = "6"
    fireEvent.change(insertColumnInput, { target: { value: nextInputValue } })
    expect(insertColumnInput.value).toBe(nextInputValue)
  })
  
  it("limits the input value to a maximum of 10", () => {
    const { insertColumnInput } = sheetColumnContextMenuInsertColumns()
    fireEvent.change(insertColumnInput, { target: { value: "11" } })
    expect(insertColumnInput.value).toBe("10")
  })

  it("displays an error message if a user with an expired subscription attempts to insert new colums", () => {
    const appState = getMockAppStateByTasksheetSubscriptionType("TRIAL_EXPIRED")
    const { insertColumnText, queryByText } = sheetColumnContextMenuInsertColumns(appState)
    insertColumnText.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message if the user doesn't have permission to edit the sheet and attempts to insert new colums", () => {
    const appState = getMockAppStateByUsersFilePermissionRole("VIEWER")
    const { insertColumnText, queryByText } = sheetColumnContextMenuInsertColumns(appState)
    insertColumnText.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })
  
  it("correctly inserts 1 column", () => {
    const { getState, insertColumnInput, insertColumnText } = sheetColumnContextMenuInsertColumns()
    const visibleColumnsCount = activeSheetView.visibleColumns.length
    fireEvent.change(insertColumnInput, { target: { value: "1" } })
    insertColumnText.click()
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.length).toBe(visibleColumnsCount + 1)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(columnId)).toBe(columnIndex + 1)
  })
  
  it("correctly inserts 5 columns", () => {
    const { getState, insertColumnInput, insertColumnText } = sheetColumnContextMenuInsertColumns()
    const visibleColumnsCount = activeSheetView.visibleColumns.length
    fireEvent.change(insertColumnInput, { target: { value: "5" } })
    insertColumnText.click()
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.length).toBe(visibleColumnsCount + 5)
    expect(getState().sheet.allSheetViews[activeSheetView.id].visibleColumns.indexOf(columnId)).toBe(columnIndex + 5)
  })
  
})