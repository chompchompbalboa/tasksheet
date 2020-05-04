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

const labelsColumnIndex = mockAppStateColumnTypes.findIndex(columnType => columnType === 'GANTT')

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
  cellType: 'GANTT',
  style: {}
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetCellGantt', () => {

  const sheetCellGantt = (appState: IAppState = mockAppState) => {
    const {
      getByTestId
    } = renderWithRedux(
      <>
        <SheetCell {...props}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const sheetCell = getByTestId("SheetCell")
    const sheetCellContainer = getByTestId("SheetCellGantt")
    return {
      sheetCell,
      sheetCellContainer
    }
  }

  it("renders correctly", async () => {
    const { sheetCell } = sheetCellGantt()
    expect(sheetCell).toBeTruthy()
  })
})