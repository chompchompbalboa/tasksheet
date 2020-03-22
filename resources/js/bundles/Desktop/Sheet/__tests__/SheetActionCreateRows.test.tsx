//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import { 
  act, 
  renderWithRedux, 
  fireEvent 
} from '@/testing/library'
import { 
  createMockStore,
  getMockAppStateByTasksheetSubscriptionType,
  getMockAppStateByUsersFilePermissionRole,
  getCellAndCellProps,
  mockAppState
} from '@/testing/mocks'
import { 
  appStateFactory, 
  IAppStateFactoryInput 
} from '@/testing/mocks/appState'
import { flushPromises } from '@/testing/utils'

import { IAppState } from '@/state'
import {
  updateSheetSelectionFromCellClick
} from '@/state/sheet/actions'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetActionCreateRows, { ISheetActionCreateRows } from '@desktop/Sheet/SheetActionCreateRows'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheets
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[fileId].typeId
const sheet = allSheets[sheetId]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetActionCreateRows = {
  sheetId: sheetId
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetActionCreateRows', () => {

  beforeAll(() => {
    (axiosMock.post as jest.Mock).mockResolvedValue({})
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  const sheetActionCreateRows = (appState: IAppState = mockAppState) => {
    const { 
      getByTestId, 
      queryByText,
      store: {
        dispatch,
        getState
      }
     } = renderWithRedux(
      <>
        <SheetActionCreateRows {...props}/>
        <Messenger />
      </>
    , {
       store: createMockStore(appState)
     })
    const container = getByTestId('SheetActionCreateRows')
    const input = getByTestId('SheetActionCreateRowsInput') as HTMLInputElement
    const insertAboveButton = getByTestId('SheetActionCreateRowsAboveButton')
    const insertBelowButton = getByTestId('SheetActionCreateRowsBelowButton')
    const tooltip = getByTestId('Tooltip')
    return {
      container,
      dispatch,
      getState,
      input,
      insertAboveButton,
      insertBelowButton,
      queryByText,
      tooltip
    }
  }
  
  it("displays an input showing the number of rows to add", async () => {
    const { input } = sheetActionCreateRows()
    expect(input).toBeTruthy()
  })
  
  it("correctly updates the input value", async () => {
    const { input } = sheetActionCreateRows()
    const nextInputValue = "3"
    expect(input.value).not.toBe(nextInputValue)
    fireEvent.change(input, { target: { value: nextInputValue } })
    expect(input.value).toBe(nextInputValue)
  })
  
  it("does not update the input value if a non-number character is entered", async () => {
    const { input } = sheetActionCreateRows()
    const inputValue = input.value
    const letter = "a"
    fireEvent.change(input, { target: { value: letter } })
    expect(input.value).toBe(inputValue)
    const character = "!"
    fireEvent.change(input, { target: { value: character } })
    expect(input.value).toBe(inputValue)
  })
  
  it("limits the input value to a maximum of 25", async () => {
    const { input } = sheetActionCreateRows()
    fireEvent.change(input, { target: { value: "50" } })
    expect(input.value).toBe("25")
  })
  
  it("displays a button that will insert the new rows above the currently selected row", async () => {
    const { insertAboveButton } = sheetActionCreateRows()
    expect(insertAboveButton).toBeTruthy()
  })
  
  it("displays a button that will insert the new rows below the currently selected row", async () => {
    const { insertBelowButton } = sheetActionCreateRows()
    expect(insertBelowButton).toBeTruthy()
  })
  
  it("highlights the button that inserts rows above by default", async () => {
    const { getState, insertAboveButton } = sheetActionCreateRows()
    expect(insertAboveButton).toHaveStyleRule('background-color', getState().user.color.primary)
  })
  
  it("displays a tooltip when the mouse hovers over the element", async () => {
    const { container, tooltip } = sheetActionCreateRows()
    expect(tooltip).toHaveStyleRule('display', 'none')
    act(() => {
      fireEvent.mouseEnter(container)
      jest.advanceTimersByTime(600)
    })
    expect(tooltip).toHaveStyleRule('display', 'block')
  })
  
  it("correctly inserts rows above the selected cell when the insert above button is clicked", async () => {
    const { dispatch, getState, input, insertAboveButton } = sheetActionCreateRows()
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    act(() => {
      dispatch(updateSheetSelectionFromCellClick(sheetId, R1C1Cell.id, false))
    })
    const sheetNumberOfRows = sheet.visibleRows.length
    const sheetSelectedRowVisibleRowsIndex = sheet.visibleRows.indexOf(R1C1Cell.rowId)
    const numberOfRowsToInsert = 5
    fireEvent.change(input, { target: { value: numberOfRowsToInsert } })
    await act(async() => {
      insertAboveButton.click()
      jest.advanceTimersByTime(10)
      await flushPromises()
    })
    expect(getState().sheet.allSheets[sheetId].visibleRows.length).toBe(sheetNumberOfRows + numberOfRowsToInsert)
    expect(getState().sheet.allSheets[sheetId].visibleRows.indexOf(R1C1Cell.rowId)).toBe(sheetSelectedRowVisibleRowsIndex + numberOfRowsToInsert)
  })
  
  it("correctly inserts rows below the selected cell when the insert below button is clicked", async () => {
    const { dispatch, getState, input, insertBelowButton } = sheetActionCreateRows()
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    act(() => {
      dispatch(updateSheetSelectionFromCellClick(sheetId, R1C1Cell.id, false))
    })
    const sheetNumberOfRows = sheet.visibleRows.length
    const sheetSelectedRowVisibleRowsIndex = sheet.visibleRows.indexOf(R1C1Cell.rowId)
    const numberOfRowsToInsert = 5
    fireEvent.change(input, { target: { value: numberOfRowsToInsert } })
    await act(async() => {
      insertBelowButton.click()
      jest.advanceTimersByTime(10)
      await flushPromises()
    })
    expect(getState().sheet.allSheets[sheetId].visibleRows.length).toBe(sheetNumberOfRows + numberOfRowsToInsert)
    expect(getState().sheet.allSheets[sheetId].visibleRows.indexOf(R1C1Cell.rowId)).toBe(sheetSelectedRowVisibleRowsIndex)
  })
  
  it("correctly inserts rows below the selected cell when the insert below button is clicked", async () => {
    const { dispatch, getState, input, insertBelowButton } = sheetActionCreateRows()
    const { cell: R1C1Cell } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    act(() => {
      dispatch(updateSheetSelectionFromCellClick(sheetId, R1C1Cell.id, false))
    })
    const sheetNumberOfRows = sheet.visibleRows.length
    const sheetSelectedRowVisibleRowsIndex = sheet.visibleRows.indexOf(R1C1Cell.rowId)
    const numberOfRowsToInsert = 5
    fireEvent.change(input, { target: { value: numberOfRowsToInsert } })
    await act(async() => {
      insertBelowButton.click()
      jest.advanceTimersByTime(10)
      await flushPromises()
    })
    expect(getState().sheet.allSheets[sheetId].visibleRows.length).toBe(sheetNumberOfRows + numberOfRowsToInsert)
    expect(getState().sheet.allSheets[sheetId].visibleRows.indexOf(R1C1Cell.rowId)).toBe(sheetSelectedRowVisibleRowsIndex)
  })
  
  it("displays an error message when a user with an expired subscription tries to create new rows", async () => {
    const appState = getMockAppStateByTasksheetSubscriptionType('TRIAL_EXPIRED')
    const { insertBelowButton, queryByText } = sheetActionCreateRows(appState)
    insertBelowButton.click()
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })
  
  it("displays an error message when a user without editing permission tries to create new rows", async () => {
    const appState = getMockAppStateByUsersFilePermissionRole('VIEWER')
    const { insertBelowButton, queryByText } = sheetActionCreateRows(appState)
    insertBelowButton.click()
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

})