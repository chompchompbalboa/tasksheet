//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { ISheet, ISheetCell, ISheetRow } from '@/state/sheet/types'

import { createHistoryStep } from '@/state/history/actions'
import { updateSheet } from '@/state/sheet/actions'
import { resolveSheetRowLeaders } from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Delete Sheet Row
//-----------------------------------------------------------------------------
export const deleteSheetRows = (sheetId: ISheet['id'], rowId: ISheetRow['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets: {
        [sheetId]: {
          rows: sheetRows,
          selections: sheetSelections,
          visibleRows: sheetVisibleRows,
          visibleRowLeaders: sheetVisibleRowLeaders
        }
      },
      allSheetRows
    } = getState().sheet
    
    //const sheetRowsForUndoActionsDatabaseUpdate: ISheetRowToDatabase[] = []
    let nextSheetRows = [ ...sheetRows ]
    let rowIdsToDelete: ISheetRow['id'][] = []
    let cellIdsToDelete: ISheetCell['id'][] = []
    
    
    const firstSelectedRowIdVisibleRowsIndex = sheetVisibleRows.indexOf(sheetSelections.rangeStartRowId)
    const lastSelectedRowIdVisibleRowsIndex = sheetVisibleRows.indexOf(sheetSelections.rangeEndRowId)
    
    if(lastSelectedRowIdVisibleRowsIndex > -1) {
      for(let currentIndex = firstSelectedRowIdVisibleRowsIndex; currentIndex <= lastSelectedRowIdVisibleRowsIndex; currentIndex++) {
        const currentRowId = sheetVisibleRows[currentIndex]
        if(currentRowId !== 'ROW_BREAK') {
          rowIdsToDelete.push(currentRowId)
        }
      }
    }
    else {
      rowIdsToDelete.push(rowId)
    }
    
    rowIdsToDelete.forEach(rowIdToDelete => {
      const sheetRow = allSheetRows[rowIdToDelete]
      if(sheetRow) {
        nextSheetRows = nextSheetRows.filter(sheetRowId => sheetRowId !== rowIdToDelete)
        Object.keys(sheetRow.cells).forEach(currentColumnId => {
          const currentCellId = sheetRow.cells[currentColumnId]
          cellIdsToDelete.push(currentCellId)
        })
      }
    })
    
    const nextSheetVisibleRows = [ 
      ...([ ...sheetVisibleRows ].splice(0, firstSelectedRowIdVisibleRowsIndex)),
      ...([ ...sheetVisibleRows ].slice(lastSelectedRowIdVisibleRowsIndex + 1)) 
    ]
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    const actions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          rows: nextSheetRows,
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetVisibleRowLeaders,
        }, true))
      })
      mutation.deleteSheetRows(rowIdsToDelete)
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          rows: sheetRows,
          visibleRows: sheetVisibleRows,
          visibleRowLeaders: sheetVisibleRowLeaders
        }, true))
      })
      mutation.restoreSheetRows(rowIdsToDelete, cellIdsToDelete)
    }
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}