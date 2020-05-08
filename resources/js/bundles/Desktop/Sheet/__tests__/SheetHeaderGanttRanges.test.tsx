//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import 'jest-styled-components'

import { 
  fireEvent,
  renderWithRedux, 
  within
} from '@/testing/library'
import { 
  createMockStore, 
  getMockAppState,
  IMockAppStateFactoryInput,
  mockAppStateColumnTypes
} from '@/testing/mocks'

import { IAppState } from '@/state'

import Messenger from '@desktop/Messenger/Messenger'
import SheetHeaderGanttRanges, { ISheetHeaderGanttRanges } from '@/bundles/Desktop/Sheet/SheetHeaderGanttRanges'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const mockAppStateFactoryInput: IMockAppStateFactoryInput = {
  numberOfFolders: 1,
  numberOfFilesPerFolder: 1,
  numberOfRowsPerSheet: 5,
  columns: [
    'DATETIME',
    'DATETIME',
    'GANTT'
  ]
}
    
console.warn = jest.fn()

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetHeaderGanttRanges', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sheetHeaderGanttRanges = (appState: IAppState = getMockAppState(mockAppStateFactoryInput)) => {
    
    const {
      folder: {
        allFolders,
        allFiles
      },
      sheet: {
        allSheets,
        allSheetColumns,
        allSheetGantts,
        allSheetViews,
      }
    } = appState
    
    const ganttColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'GANTT')
    const sheetGanttId = allSheetGantts[Object.keys(allSheetGantts)[0]].id
    
    const folderId = Object.keys(allFolders)[0]
    const fileId = allFolders[folderId].files[0]
    const file = allFiles[fileId]
    const sheetId = file.typeId
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const sheetColumnId = activeSheetView.visibleColumns[ganttColumnIndex]
    const dateColumn1Id = activeSheetView.visibleColumns[0]
    const dateColumn2Id = activeSheetView.visibleColumns[1]

    const props: ISheetHeaderGanttRanges = {
      sheetId: sheetId,
      columnId: sheetColumnId,
      sheetGanttId
    }

    const {
      getAllByText,
      getAllByTestId,
      getByTestId,
      getByText,
      queryByText,
      store: {
        getState
      }
    } = renderWithRedux(
      <>
        <SheetHeaderGanttRanges {...props}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const dropdown = getByTestId('SheetHeaderGanttRangesDropdown')
    const dropdownButton = getByTestId('SheetHeaderGanttRangesDropdownButton')
    const startColumn = within(dropdown).getByText("Start Column")
    const endColumn = within(dropdown).getByText("End Column (Optional)")
    const dateColumn1 = allSheetColumns[dateColumn1Id]
    const dateColumn2 = allSheetColumns[dateColumn2Id]
    const startColumnDateColumn1 = within(dropdown).getAllByText(dateColumn1.name)[0]
    const endColumnDateColumn2 = within(dropdown).getAllByText(dateColumn2.name)[1]
    const createGanttRangeButton = within(dropdown).getByTestId("SheetHeaderGanttRangesCreateRangeButton")
    const deleteButtons = () => getAllByTestId("SheetHeaderGanttRangesRangeDeleteButton")
    return {
      createGanttRangeButton,
      dateColumn1,
      dateColumn2,
      deleteButtons,
      dropdown,
      dropdownButton,
      endColumn,
      endColumnDateColumn2, 
      getAllByText,
      getState,
      getByText,
      queryByText,
      startColumn,
      startColumnDateColumn1, 
    }
  }

  it("displays a button that opens a dropdown when clicked", async () => {
    const { dropdown, dropdownButton } = sheetHeaderGanttRanges()
    expect(dropdown).toHaveStyleRule('display', 'none')
    fireEvent.click(dropdownButton)
    expect(dropdown).toHaveStyleRule('display', 'block')
  })

  it("in the dropdown, displays the options to select a start and end column and create a new gantt range", async () => {
    const { createGanttRangeButton, startColumn, endColumn } = sheetHeaderGanttRanges()
    expect(startColumn).toBeTruthy()
    expect(endColumn).toBeTruthy()
    expect(createGanttRangeButton).toBeTruthy()
  })

  it("correctly creates and displays a new gantt range with only a start date", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { createGanttRangeButton, dateColumn1, getAllByText, getState, startColumnDateColumn1 } = sheetHeaderGanttRanges()
    expect(getState().sheet.allSheetGanttRanges).toBeNull()
    expect(getAllByText(dateColumn1.name).length).toBe(2)
    fireEvent.click(startColumnDateColumn1)
    fireEvent.click(createGanttRangeButton)
    expect(getState().sheet.allSheetGanttRanges).not.toBeNull()
    expect(Object.keys(getState().sheet.allSheetGanttRanges).length).toBe(1)
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].startDateColumnId).not.toBeNull()
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].endDateColumnId).toBeNull()
    expect(getAllByText(dateColumn1.name).length).toBe(3)
  })

  it("correctly creates and displays a new gantt range with a start date and an end date", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { createGanttRangeButton, dateColumn1, dateColumn2, endColumnDateColumn2, getState, queryByText, startColumnDateColumn1 } = sheetHeaderGanttRanges()
    expect(getState().sheet.allSheetGanttRanges).toBeNull()
    fireEvent.click(startColumnDateColumn1)
    fireEvent.click(endColumnDateColumn2)
    fireEvent.click(createGanttRangeButton)
    expect(getState().sheet.allSheetGanttRanges).not.toBeNull()
    expect(Object.keys(getState().sheet.allSheetGanttRanges).length).toBe(1)
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].startDateColumnId).not.toBeNull()
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].endDateColumnId).not.toBeNull()
    expect(queryByText(dateColumn1.name + ' - ' + dateColumn2.name)).toBeTruthy()
  })

  it("correctly deletes a gantt range", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValue({});
    (axiosMock.patch as jest.Mock).mockResolvedValue({});
    const { createGanttRangeButton, dateColumn1, dateColumn2, deleteButtons, endColumnDateColumn2, getState, queryByText, startColumnDateColumn1 } = sheetHeaderGanttRanges()
    expect(getState().sheet.allSheetGanttRanges).toBeNull()
    fireEvent.click(startColumnDateColumn1)
    fireEvent.click(endColumnDateColumn2)
    fireEvent.click(createGanttRangeButton)
    expect(getState().sheet.allSheetGanttRanges).not.toBeNull()
    expect(Object.keys(getState().sheet.allSheetGanttRanges).length).toBe(1)
    expect(queryByText(dateColumn1.name + ' - ' + dateColumn2.name)).toBeTruthy()
    const deleteButton = deleteButtons()[0]
    fireEvent.click(deleteButton)
    expect(Object.keys(getState().sheet.allSheetGanttRanges).length).toBe(0)
    expect(axiosMock.post).toHaveBeenCalledTimes(2)
    expect(queryByText(dateColumn1.name + ' - ' + dateColumn2.name)).not.toBeTruthy()
  })
})