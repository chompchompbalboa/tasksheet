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
    const startColumnDateColumn1 = within(dropdown).getAllByText(allSheetColumns[dateColumn1Id].name)[0]
    const endColumnDateColumn2 = within(dropdown).getAllByText(allSheetColumns[dateColumn2Id].name)[1]
    const createGanttRangeButton = within(dropdown).getByTestId("SheetHeaderGanttRangesCreateRangeButton")
    return {
      createGanttRangeButton,
      startColumnDateColumn1, 
      endColumnDateColumn2, 
      dropdown,
      dropdownButton,
      endColumn,
      getState,
      getByText,
      queryByText,
      startColumn
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

  it("correctly creates a new gantt range with only a start date", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { createGanttRangeButton, getState, startColumnDateColumn1 } = sheetHeaderGanttRanges()
    expect(getState().sheet.allSheetGanttRanges).toBeNull()
    fireEvent.click(startColumnDateColumn1)
    fireEvent.click(createGanttRangeButton)
    expect(getState().sheet.allSheetGanttRanges).not.toBeNull()
    expect(Object.keys(getState().sheet.allSheetGanttRanges).length).toBe(1)
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].startDateColumnId).not.toBeNull()
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].endDateColumnId).toBeNull()
  })

  it("correctly creates a new gantt range with a start date and an end date", async () => {
    (axiosMock.post as jest.Mock).mockResolvedValueOnce({})
    const { createGanttRangeButton, endColumnDateColumn2, getState, startColumnDateColumn1 } = sheetHeaderGanttRanges()
    expect(getState().sheet.allSheetGanttRanges).toBeNull()
    fireEvent.click(startColumnDateColumn1)
    fireEvent.click(endColumnDateColumn2)
    fireEvent.click(createGanttRangeButton)
    expect(getState().sheet.allSheetGanttRanges).not.toBeNull()
    expect(Object.keys(getState().sheet.allSheetGanttRanges).length).toBe(1)
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].startDateColumnId).not.toBeNull()
    expect(getState().sheet.allSheetGanttRanges[Object.keys(getState().sheet.allSheetGanttRanges)[0]].endDateColumnId).not.toBeNull()
  })
})