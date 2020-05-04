//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { 
  renderWithRedux
} from '@/testing/library'
import { 
  createMockStore, 
  mockAppState,
  mockAppStateColumnTypes
} from '@/testing/mocks'

import { IAppState } from '@/state'

import Messenger from '@desktop/Messenger/Messenger'
import SheetHeaderGantt, { ISheetHeaderGantt } from '@/bundles/Desktop/Sheet/SheetHeaderGantt'

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

const labelsColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'GANTT')

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
const props: ISheetHeaderGantt = {
  sheetId: sheetId,
  columnId: sheetColumnId,
  isResizing: false
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetHeaderGantt', () => {

  const sheetHeaderGantt = (appState: IAppState = mockAppState) => {
    const {
      queryByTestId
    } = renderWithRedux(
      <>
        <SheetHeaderGantt {...props}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    return {
      queryByTestId
    }
  }

  it("displays SheetHeaderGanttRanges correctly", async () => {
    const { queryByTestId } = sheetHeaderGantt()
    expect(queryByTestId("SheetHeaderGanttRanges")).toBeTruthy()
  })

  it("displays SheetHeaderGanttDates correctly", async () => {
    const { queryByTestId } = sheetHeaderGantt()
    expect(queryByTestId("SheetHeaderGanttDates")).toBeTruthy()
  })
})