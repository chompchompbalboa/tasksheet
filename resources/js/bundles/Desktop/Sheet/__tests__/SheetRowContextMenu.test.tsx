//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'

import { 
  act,
  fireEvent,
  renderWithRedux
} from '@/testing/library'
import {
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType,
  getMockAppStateByUsersFilePermissionRole,
  mockAppState,
  mockAppStateFactory,
  IMockAppStateFactoryInput
} from '@/testing/mocks'
import {
  flushPromises
} from '@/testing/utils'

import { IAppState } from '@/state'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetRowContextMenu, { ISheetRowContextMenuProps } from '@desktop/Sheet/SheetRowContextMenu'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets
} = mockAppStateFactory({} as IMockAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]
const sheetRowId = sheet.visibleRows[0]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetRowContextMenuProps = {
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

  const sheetRowContextMenu = (appState: IAppState = mockAppState) => {
    const { 
      getByTestId,
      store: {
        getState
      },
      queryByText
     } = renderWithRedux(
      <>
        <SheetRowContextMenu {...props}/>
        <Messenger />
      </>
    , {
       store: createMockStore(appState)
     })
    
    const insertRowsAboveContainer = getByTestId("SheetRowContextMenuCreateRowsAboveContainer")
    const insertRowsBelowContainer = getByTestId("SheetRowContextMenuCreateRowsBelowContainer")
    const insertRowsAboveInput = getByTestId("SheetRowContextMenuCreateRowsAboveInput") as HTMLInputElement
    const insertRowsBelowInput = getByTestId("SheetRowContextMenuCreateRowsBelowInput") as HTMLInputElement
    const deleteRowsContainer = getByTestId("SheetRowContextMenuDeleteRows") as HTMLInputElement
    return {
      deleteRowsContainer,
      getState,
      insertRowsAboveContainer,
      insertRowsAboveInput,
      insertRowsBelowContainer,
      insertRowsBelowInput,
      queryByText
    }
  }

  it("displays a menu item with an input to insert rows above the current row", () => {
    const { insertRowsAboveContainer, insertRowsAboveInput } = sheetRowContextMenu()
    expect(insertRowsAboveContainer).toBeTruthy()
    expect(insertRowsAboveInput).toBeTruthy()
  })

  it("correctly updates the input to insert rows above the current row", () => {
    const { insertRowsAboveInput } = sheetRowContextMenu()
    const nextValue = "5"
    fireEvent.change(insertRowsAboveInput, { target: { value: nextValue } })
    expect(insertRowsAboveInput.value).toBe(nextValue)
  })

  it("displays a menu item with an input to insert rows below the current row", () => {
    const { insertRowsBelowContainer, insertRowsBelowInput } = sheetRowContextMenu()
    expect(insertRowsBelowContainer).toBeTruthy()
    expect(insertRowsBelowInput).toBeTruthy()
  })

  it("correctly updates the input to insert rows below the current row", () => {
    const { insertRowsBelowInput } = sheetRowContextMenu()
    const nextValue = "5"
    fireEvent.change(insertRowsBelowInput, { target: { value: nextValue } })
    expect(insertRowsBelowInput.value).toBe(nextValue)
  })
  
  it("limits the input values to a maximum of 25", () => {
    const { insertRowsAboveInput, insertRowsBelowInput } = sheetRowContextMenu()
    fireEvent.change(insertRowsAboveInput, { target: { value: "50" } })
    expect(insertRowsAboveInput.value).toBe("25")
    fireEvent.change(insertRowsBelowInput, { target: { value: "50" } })
    expect(insertRowsBelowInput.value).toBe("25")
  })
  
  it("correctly inserts rows above the selected cell", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValue({})
    const { getState, insertRowsAboveInput } = sheetRowContextMenu()
    const sheetNumberOfRows = sheet.visibleRows.length
    const sheetSelectedRowVisibleRowsIndex = sheet.visibleRows.indexOf(sheetRowId)
    const numberOfRowsToInsert = 5
    fireEvent.change(insertRowsAboveInput, { target: { value: numberOfRowsToInsert } })
    await act(async() => {
      fireEvent.keyPress(insertRowsAboveInput, { key: "Enter", charCode: 13 })
      await flushPromises()
    })
    expect(getState().sheet.allSheets[sheetId].visibleRows.length).toBe(sheetNumberOfRows + numberOfRowsToInsert)
    expect(getState().sheet.allSheets[sheetId].visibleRows.indexOf(sheetRowId)).toBe(sheetSelectedRowVisibleRowsIndex + numberOfRowsToInsert)
  })
  
  it("correctly inserts rows below the selected cell", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValue({})
    const { getState, insertRowsBelowInput } = sheetRowContextMenu()
    const sheetNumberOfRows = sheet.visibleRows.length
    const sheetSelectedRowVisibleRowsIndex = sheet.visibleRows.indexOf(sheetRowId)
    const numberOfRowsToInsert = 5
    fireEvent.change(insertRowsBelowInput, { target: { value: numberOfRowsToInsert } })
    await act(async() => {
      fireEvent.keyPress(insertRowsBelowInput, { key: "Enter", charCode: 13 })
      await flushPromises()
    })
    expect(getState().sheet.allSheets[sheetId].visibleRows.length).toBe(sheetNumberOfRows + numberOfRowsToInsert)
    expect(getState().sheet.allSheets[sheetId].visibleRows.indexOf(sheetRowId)).toBe(sheetSelectedRowVisibleRowsIndex)
  })

  it("displays a menu item to delete the current row", () => {
    const { deleteRowsContainer } = sheetRowContextMenu()
    expect(deleteRowsContainer).toBeTruthy()
  })

  it("correctly deletes the current row", async () => {
    const { deleteRowsContainer, getState } = sheetRowContextMenu()
    const sheetNumberOfRows = sheet.visibleRows.length
    await act(async() => {
      deleteRowsContainer.click()
      await flushPromises()
    })
    expect(getState().sheet.allSheets[sheetId].visibleRows.length).toBe(sheetNumberOfRows - 1)
    expect(getState().sheet.allSheets[sheetId].visibleRows.indexOf(sheetRowId)).toBe(-1)
  })

  it("displays an error message when a user with an expired subscription tries to insert new rows", () => {
    const appState = getMockAppStateByTasksheetSubscriptionType('TRIAL_EXPIRED')
    const { insertRowsAboveInput, queryByText } = sheetRowContextMenu(appState)
    fireEvent.keyPress(insertRowsAboveInput, { key: "Enter", charCode: 13 })
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })


  it("displays an error message when the user tries to insert new rows without permission", () => {
    const appState = getMockAppStateByUsersFilePermissionRole('VIEWER')
    const { insertRowsAboveInput, queryByText } = sheetRowContextMenu(appState)
    fireEvent.keyPress(insertRowsAboveInput, { key: "Enter", charCode: 13 })
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message when a user with an expired subscription tries to delete the row", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType('TRIAL_EXPIRED')
    const { deleteRowsContainer, queryByText } = sheetRowContextMenu(appState)
    await act(async() => {
      deleteRowsContainer.click()
      await flushPromises()
    })
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })


  it("displays an error message when the user tries to delete the row without permission", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole('VIEWER')
    const { deleteRowsContainer, queryByText } = sheetRowContextMenu(appState)
    await act(async() => {
      deleteRowsContainer.click()
      await flushPromises()
    })
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })
})