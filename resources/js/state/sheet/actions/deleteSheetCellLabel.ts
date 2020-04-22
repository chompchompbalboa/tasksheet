//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet,
  ISheetCell, 
  ISheetLabel 
} from '@/state/sheet/types'

import { createHistoryStep } from '@/state/history/actions'
import { 
  setAllSheets,
  setAllSheetCells,
  setAllSheetCellLabels
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet CellLabel
//-----------------------------------------------------------------------------
export const deleteSheetCellLabel = (
  sheetId: ISheet['id'],
  sheetCellId: ISheetCell['id'], 
  sheetCellLabelId: ISheetLabel['id']
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheets,
        allSheetCells,
        allSheetCellLabels,
        allSheetLabels
      }
    } = getState()

    // Variables
    const sheetLabel = allSheetLabels[sheetCellLabelId]
    const sheetCell = allSheetCells[sheetCellId]
    const sheetSelections = allSheets[sheetId].selections

    // Next Sheet Cell Value
    const nextSheetCellValue = sheetCell.value ? sheetCell.value.replace(sheetLabel.value + ';', '') : ''

    // Next All Sheet Cells
    const nextAllSheetCells = {
      ...allSheetCells,
      [sheetCellId]: {
        ...allSheetCells[sheetCellId],
        value: nextSheetCellValue
      }
    }
    
    // Next All Sheet Cell Labels
    const nextAllSheetCellLabels = {
      ...allSheetCellLabels,
      [sheetCellId]: allSheetCellLabels[sheetCellId].filter(currentSheetCellLabelId => currentSheetCellLabelId !== sheetCellLabelId)
    }

    // Actions
    const actions = () => {
      dispatch(setAllSheetCells(nextAllSheetCells))
      dispatch(setAllSheetCellLabels(nextAllSheetCellLabels))
      dispatch(setAllSheets({
        ...allSheets,
        [sheetId]: {
          ...allSheets[sheetId],
          selections: sheetSelections
        }
      }))
      mutation.updateSheetCell(sheetCellId, { value: nextSheetCellValue })
      mutation.deleteSheetCellLabel(sheetCellLabelId)
    }

    // Undo Actions
    const undoActions = () => {
      dispatch(setAllSheetCells(allSheetCells))
      dispatch(setAllSheetCellLabels(allSheetCellLabels))
      dispatch(setAllSheets({
        ...allSheets,
        [sheetId]: {
          ...allSheets[sheetId],
          selections: sheetSelections
        }
      }))
      mutation.updateSheetCell(sheetCellId, { value: sheetCell.value })
      mutation.restoreSheetCellLabel(sheetCellLabelId)
    }

    // Create the history step
    dispatch(createHistoryStep({ actions, undoActions }))

    // Call the actions
    actions()
  }
}