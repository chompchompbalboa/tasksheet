//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { 
  renderWithRedux
} from '@/testing/library'
import { 
  createMockStore, 
  getMockAppState,
  IMockAppStateFactoryInput
} from '@/testing/mocks'
import {
  flushPromises
} from '@/testing/utils'

import { IAppState } from '@/state'

import { createSheetGanttRange } from '@/state/sheet/actions'

import Messenger from '@desktop/Messenger/Messenger'
import SheetCell, { ISheetCellProps } from '@/bundles/Desktop/Sheet/SheetCell'

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
describe('SheetCellGantt', () => {

  const sheetCellGantt = (appState: IAppState = getMockAppState(mockAppStateFactoryInput)) => {
    
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
    
    const folderId = Object.keys(allFolders)[0]
    const fileId = allFolders[folderId].files[0]
    const file = allFiles[fileId]
    const sheetId = file.typeId
    const sheet = allSheets[sheetId]
    const sheetGanttId = allSheetGantts[Object.keys(allSheetGantts)[0]].id
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const ganttColumnIndex = activeSheetView.visibleColumns.findIndex(columnId => allSheetColumns[columnId].cellType === 'GANTT')
    const sheetColumnId = activeSheetView.visibleColumns[ganttColumnIndex]
    const sheetRowId = sheet.visibleRows[0]
    const dateColumn1Id = activeSheetView.visibleColumns[0]
    const dateColumn2Id = activeSheetView.visibleColumns[1]
    const dateColumn1 = allSheetColumns[dateColumn1Id]
    const dateColumn2 = allSheetColumns[dateColumn2Id]
    
    const props: ISheetCellProps = {
      sheetId: sheetId,
      columnId: sheetColumnId,
      rowId: sheetRowId,
      cellType: 'GANTT',
      style: {}
    }
    
    const {
      debug,
      queryAllByTestId,
      store: {
        dispatch
      }
    } = renderWithRedux(
      <>
        <SheetCell {...props}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    
    return {
      dateColumn1,
      
      dateColumn2,
      debug,
      dispatch,
      queryAllByTestId,
      sheetId,
      sheetGanttId
    }
}

  it("displays a gantt range with only a start date correctly", async () => {
    const { dateColumn1, debug, dispatch, queryAllByTestId, sheetId, sheetGanttId } = sheetCellGantt()
    expect(queryAllByTestId('SheetCellGanttRangeMilestone').length).toBe(0)
    dispatch(createSheetGanttRange(sheetId, sheetGanttId, dateColumn1.id))
    await flushPromises()
    debug()
    expect(queryAllByTestId('SheetCellGanttRangeMilestone').length).toBe(1)
  })
  
})