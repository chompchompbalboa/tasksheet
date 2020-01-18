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
    
    // Variables
    let nextSheetRows = [ ...sheetRows ]
    let rowIdsToDelete: ISheetRow['id'][] = []
    let cellIdsToDelete: ISheetCell['id'][] = []
    
    // Get the index of the first and last rows to delete
    const firstSelectedRowIdVisibleRowsIndex = sheetVisibleRows.indexOf(sheetSelections.rangeStartRowId) > -1
      ? sheetVisibleRows.indexOf(sheetSelections.rangeStartRowId)
      : sheetVisibleRows.indexOf(rowId)
    
    const lastSelectedRowIdVisibleRowsIndex = sheetVisibleRows.indexOf(sheetSelections.rangeEndRowId) > -1
      ? sheetVisibleRows.indexOf(sheetSelections.rangeEndRowId)
      : sheetVisibleRows.indexOf(rowId)
    
    // Get the ids for the rows that will be deleted
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
    
    // Get the ids for the cells that will be deleted
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
    
    // Remove the deleted rows from the visible rows
    const nextSheetVisibleRows = sheetVisibleRows.map((visibleRowId, index) => {
      if(index < firstSelectedRowIdVisibleRowsIndex || index > lastSelectedRowIdVisibleRowsIndex) {
        return visibleRowId
      }
    }).filter(Boolean)

    // Calculate the next row leaders
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    // Actions
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
    
    // Undo Actions
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

    // Create the history step and call the actions
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}