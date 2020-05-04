//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
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

const {
  folder: {
    allFolders,
    allFiles
  },
  sheet: {
    allSheets,
    allSheetGantts,
    allSheetViews
  }
} = getMockAppState(mockAppStateFactoryInput)

const labelsColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'GANTT')
const sheetGanttId = allSheetGantts[Object.keys(allSheetGantts)[0]].id

const folderId = Object.keys(allFolders)[0]
const fileId = allFolders[folderId].files[0]
const file = allFiles[fileId]
const sheetId = file.typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]
const sheetColumnId = activeSheetView.visibleColumns[labelsColumnIndex]

console.warn = jest.fn()

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetHeaderGanttRanges = {
  sheetId: sheetId,
  columnId: sheetColumnId,
  sheetGanttId
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetHeaderGanttRanges', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sheetHeaderGanttRanges = (appState: IAppState = getMockAppState(mockAppStateFactoryInput)) => {
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
    const createGanttRangeButton = within(dropdown).getByTestId("SheetHeaderGanttRangesCreateRangeButton")
    return {
      createGanttRangeButton,
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
    const { createGanttRangeButton, startColumn, endColumn } = sheetHeaderGanttRanges()
    expect(startColumn).toBeTruthy()
    expect(endColumn).toBeTruthy()
    expect(createGanttRangeButton).toBeTruthy()
  })
})