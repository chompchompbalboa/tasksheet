//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetCellUpdates } from '@app/state/sheet/types'

import { createHistoryStep } from '@app/state/history/actions'
import { setAllSheetCells, updateSheet } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
let updateSheetCellValuesTimeout: number = null
export const updateSheetCellValues = (sheetId: ISheet['id'], value: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          selections: {
            rangeStartColumnId,
            rangeEndColumnId,
            rangeCellIds,
            ...sheetSelections
          }
        }
      },
      allSheetCells
    } = getState().sheet

    // Only update the values if a single column is selected
    if(rangeStartColumnId === rangeEndColumnId) {

      const { ...nextAllSheetCells } = allSheetCells

      // Variables to hold the database updates
      const databaseUpdates: ISheetCellUpdates[] = []
      const databaseUndoUpdates: ISheetCellUpdates[] = []

      // Clear the timeout that prevents the database updates from being called too frequently
      clearTimeout(updateSheetCellValuesTimeout)

      // Update the cell values
      rangeCellIds.forEach(sheetCellId => {
        const sheetCell = nextAllSheetCells[sheetCellId]
        nextAllSheetCells[sheetCellId] = {
          ...sheetCell,
          value: value
        }
        databaseUpdates.push({ id: sheetCellId, value: value })
        databaseUndoUpdates.push({ id: sheetCellId, value: sheetCell.value })
      })

      // Create the history step and update the cell values
      const actions = () => {
        clearTimeout(updateSheetCellValuesTimeout)
        dispatch(updateSheet(sheetId, {
          selections: {
            rangeStartColumnId,
            rangeEndColumnId,
            rangeCellIds,
            ...sheetSelections
          }
        }, true))
        dispatch(setAllSheetCells(nextAllSheetCells))
        updateSheetCellValuesTimeout = setTimeout(() => mutation.updateSheetCells(databaseUpdates), 1000)
      }

      const undoActions = () => {
        clearTimeout(updateSheetCellValuesTimeout)
        dispatch(updateSheet(sheetId, {
          selections: {
            rangeStartColumnId,
            rangeEndColumnId,
            rangeCellIds,
            ...sheetSelections
          }
        }, true))
        dispatch(setAllSheetCells(allSheetCells))
        updateSheetCellValuesTimeout = setTimeout(() => mutation.updateSheetCells(databaseUndoUpdates), 1000)
      }

      dispatch(createHistoryStep({ actions, undoActions }))
      actions()
    }
	}
}