//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheetRow } from '@app/state/sheet/types'

import { createHistoryStep } from '@app/state/history/actions'
import { updateSheet } from '@app/state/sheet/actions'
import { resolveSheetRowLeaders } from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Delete Sheet Row
//-----------------------------------------------------------------------------
export const deleteSheetRow = (sheetId: string, rowId: ISheetRow['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetCells,
      allSheetRows
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const sheetRow = allSheetRows[rowId]
    const cellsForUndoActionsDatabaseUpdate = Object.keys(sheetRow.cells).map(columnId => allSheetCells[sheetRow.cells[columnId]])
    const nextSheetRows = sheet.rows.filter(sheetRowId => sheetRowId !== rowId)
    const nextSheetVisibleRows = sheet.visibleRows.filter(visibleRowId => visibleRowId !== rowId)
    const nextSheetDefaultVisibleRows = sheet.defaultVisibleRows.filter(visibleRowId => visibleRowId !== rowId)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    
    const actions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          rows: nextSheetRows,
          defaultVisibleRows: nextSheetDefaultVisibleRows,
          rowLeaders: nextSheetRowLeaders,
          visibleRows: nextSheetVisibleRows,
        }))
      })
      mutation.deleteSheetRow(rowId)
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          rows: sheet.rows,
          defaultVisibleRows: sheet.defaultVisibleRows,
          rowLeaders: sheet.rowLeaders,
          visibleRows: sheet.visibleRows
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