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
  mockAppStateColumnTypes
} from '@/testing/mocks'

import { IAppState } from '@/state'

import { 
  historyRedo,
  historyUndo
} from '@/state/history/actions'
 
import { 
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import Messenger from '@desktop/Messenger/Messenger'
import SheetCell, { ISheetCellProps } from '@/bundles/Desktop/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  folder: {
    allFolders,
    allFiles
  },
  sheet: {
    allSheets,
    allSheetViews
  }
} = mockAppState

const labelsColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'LABELS')

const folderId = Object.keys(allFolders)[0]
const fileId = allFolders[folderId].files[0]
const file = allFiles[fileId]
const sheetId = file.typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const sheetRowId = sheet.visibleRows[0]
const sheetColumnId = activeSheetView.visibleColumns[labelsColumnIndex]

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetCellProps = {
  sheetId: sheetId,
  columnId: sheetColumnId,
  rowId: sheetRowId,
  cellType: 'LABELS',
  style: {}
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetCellLabels', () => {

  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    (axiosMock.post as jest.Mock).mockResolvedValue({});
    (axiosMock.patch as jest.Mock).mockResolvedValue({});
    (axiosMock.delete as jest.Mock).mockResolvedValue({});
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sheetCellLabels = (appState: IAppState = mockAppState) => {
    const {
      getByTestId,
      queryByTestId,
      queryByText,
      store: {
        dispatch
      }
    } = renderWithRedux(
      <>
        <SheetCell {...props}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const sheetCell = getByTestId("SheetCell")
    const sheetCellContainer = getByTestId("SheetCellLabels")
    const inputQuery = () => queryByTestId("SheetCellLabelsInput")
    const input = () => getByTestId("SheetCellLabelsInput") as HTMLInputElement
    const labelsContainer = getByTestId("SheetCellLabelsLabelsContainer")
    const valueContainer = getByTestId("SheetCellLabelsValueContainer")
    const deleteButton = () => getByTestId("SheetCellLabelsLabelDeleteButton")
    return {
      deleteButton,
      dispatch,
      input,
      inputQuery,
      labelsContainer,
      sheetCell,
      sheetCellContainer,
      queryByText,
      valueContainer
    }
  }

  it("displays a container for the labels", async () => {
    const { labelsContainer } = sheetCellLabels()
    expect(labelsContainer).toBeTruthy()
  })

  it("prevents a user who doesn't have permission to edit the sheet from editing the cell", async () => {
    const { sheetCellContainer, queryByText } = sheetCellLabels(getMockAppStateByUsersFilePermissionRole('VIEWER'))
    fireEvent.doubleClick(sheetCellContainer)
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })

  it("prevents a user who doesn't have permission to edit the sheet from editing the cell", async () => {
    const { sheetCellContainer, queryByText } = sheetCellLabels(getMockAppStateByTasksheetSubscriptionType('TRIAL_EXPIRED'))
    fireEvent.doubleClick(sheetCellContainer)
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an input when the user double clicks on the cell", async () => {
    const { input, sheetCellContainer } = sheetCellLabels()
    fireEvent.doubleClick(sheetCellContainer)
    expect(input()).toBeTruthy()
  })

  it("displays an input when the user presses a key while the cell is selected", async () => {
    const { input, sheetCell, sheetCellContainer } = sheetCellLabels()
    fireEvent.mouseDown(sheetCell)
    fireEvent.keyDown(sheetCellContainer, { key: "A" })
    expect(input()).toBeTruthy()
    expect(input().value).toBe("A")
  })

  it("correctly updates the input value", async () => {
    const { input, sheetCellContainer } = sheetCellLabels()
    const nextInputValue = "Next Input Value"
    fireEvent.doubleClick(sheetCellContainer)
    expect(input().value).not.toBe(nextInputValue)
    fireEvent.change(input(), { target: { value: nextInputValue }})
    expect(input().value).toBe(nextInputValue)
  })

  it("correctly creates one label with the input value when the user presses 'Enter'", async () => {
    const { input, inputQuery, labelsContainer, sheetCellContainer, valueContainer } = sheetCellLabels()
    const newLabelValue = "New Label"
    fireEvent.doubleClick(sheetCellContainer)
    fireEvent.change(input(), { target: { value: newLabelValue }})
    fireEvent.keyDown(sheetCellContainer, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(25)
    })
    expect(inputQuery()).not.toBeTruthy()
    expect(valueContainer.textContent).not.toContain(newLabelValue)
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(1) // Create the new label
    expect(axiosMock.patch).toHaveBeenCalledTimes(1) // Update the cell value
  })

  it("correctly creates a second label with the second input value when the user presses 'Enter'", async () => {
    const { input, inputQuery, labelsContainer, sheetCellContainer, valueContainer } = sheetCellLabels()
    const newLabelValue = "New Label"
    const newLabelValue2 = "New Label 2"
    fireEvent.doubleClick(sheetCellContainer)
    fireEvent.change(input(), { target: { value: newLabelValue }})
    fireEvent.keyDown(sheetCellContainer, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(25)
    })
    expect(inputQuery()).not.toBeTruthy()
    expect(valueContainer.textContent).not.toContain(newLabelValue)
    expect(labelsContainer.textContent).toContain(newLabelValue)
    fireEvent.doubleClick(sheetCellContainer)
    fireEvent.change(input(), { target: { value: newLabelValue2 }})
    fireEvent.keyDown(sheetCellContainer, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(25)
    })
    expect(inputQuery()).not.toBeTruthy()
    expect(valueContainer.textContent).not.toContain(newLabelValue2)
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(labelsContainer.textContent).toContain(newLabelValue2)
    expect(axiosMock.post).toHaveBeenCalledTimes(2) // Create the new label
    expect(axiosMock.patch).toHaveBeenCalledTimes(2) // Update the cell value
  })

  it("correctly deletes a label", async () => {
    const { deleteButton, input, labelsContainer, sheetCellContainer } = sheetCellLabels()
    const newLabelValue = "New Label"
    fireEvent.doubleClick(sheetCellContainer)
    fireEvent.change(input(), { target: { value: newLabelValue }})
    fireEvent.keyDown(sheetCellContainer, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(25)
    })
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(1) // Create the label
    expect(deleteButton()).toBeTruthy()
    fireEvent.click(deleteButton())
    expect(labelsContainer.textContent).not.toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(2) // Delete the label
  })
  
  it("correctly undos and redos creating a label", async () => {
    const { dispatch, input, labelsContainer, sheetCellContainer } = sheetCellLabels()
    const newLabelValue = "New Label"
    fireEvent.doubleClick(sheetCellContainer)
    fireEvent.change(input(), { target: { value: newLabelValue }})
    fireEvent.keyDown(sheetCellContainer, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(25)
    })
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(1) // Create the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(1) // Update the cell value
    dispatch(historyUndo())
    expect(labelsContainer.textContent).not.toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(2) // Delete the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(2) // Update the cell value
    dispatch(historyRedo())
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(3) // Create the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(3) // Update the cell value
  })

  it("correctly undos and redos deleting a label", async () => {
    const { deleteButton, dispatch, input, labelsContainer, sheetCellContainer } = sheetCellLabels()
    const newLabelValue = "New Label"
    fireEvent.doubleClick(sheetCellContainer)
    fireEvent.change(input(), { target: { value: newLabelValue }})
    fireEvent.keyDown(sheetCellContainer, { key: "Enter" })
    act(() => {
      jest.advanceTimersByTime(25)
    })
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(deleteButton()).toBeTruthy()
    expect(axiosMock.post).toHaveBeenCalledTimes(1) // Create the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(1) // Update the cell value
    fireEvent.click(deleteButton())
    expect(labelsContainer.textContent).not.toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(2) // Delete the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(2) // Update the cell value
    dispatch(historyUndo())
    expect(labelsContainer.textContent).toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(3) // Restore the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(3) // Update the cell value
    dispatch(historyRedo())
    expect(labelsContainer.textContent).not.toContain(newLabelValue)
    expect(axiosMock.post).toHaveBeenCalledTimes(4) // Delete the label
    expect(axiosMock.patch).toHaveBeenCalledTimes(4) // Update the cell value
  })
})