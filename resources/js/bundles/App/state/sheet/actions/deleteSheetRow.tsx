//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheetRow } from '@app/state/sheet/types'

import { createHistoryStep } from '@app/state/history/actions'
import { updateSheet, updateSheetView } from '@app/state/sheet/actions'
import { resolveSheetRowLeaders } from '@app/state/sheet/resolvers'


//-----------------------------------------------------------------------------
// Delete Sheet Row
//-----------------------------------------------------------------------------
export const deleteSheetRow = (sheetId: string, rowId: ISheetRow['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetCells,
      allSheetRows,
      allSheetViews
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]


    const sheetRow = allSheetRows[rowId]
    const cellsForUndoActionsDatabaseUpdate = Object.keys(sheetRow.cells).map(columnId => allSheetCells[sheetRow.cells[columnId]])
    const nextSheetRows = sheet.rows.filter(sheetRowId => sheetRowId !== rowId)
    const nextSheetViewVisibleRows = activeSheetView.visibleRows.filter(visibleRowId => visibleRowId !== rowId)
    const nextSheetViewRowLeaders = resolveSheetRowLeaders(nextSheetViewVisibleRows)
    
    const actions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          rows: nextSheetRows,
        }))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleRowLeaders: nextSheetViewRowLeaders,
          visibleRows: nextSheetViewVisibleRows,
        }))
      })
      mutation.deleteSheetRow(rowId)
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          rows: sheet.rows
        }))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleRowLeaders: activeSheetView.visibleRowLeaders,
          visibleRows: activeSheetView.visibleRows,
        }))
        mutation.createSheetRows([{
          ...sheetRow,
          cells: cellsForUndoActionsDatabaseUpdate
        }])
      })
    }
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}