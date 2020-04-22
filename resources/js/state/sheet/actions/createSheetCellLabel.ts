//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetCell, ISheetLabel } from '@/state/sheet/types'

import { createHistoryStep } from '@/state/history/actions'
import { 
  setAllSheets,
  setAllSheetCells,
  setAllSheetCellLabels,
  setAllSheetLabels
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Cell Label
//-----------------------------------------------------------------------------
export const createSheetCellLabel = (
  sheetId: ISheet['id'], 
  cellId: ISheetCell['id'],
  labelValue: string,
  previousCellValue: string,
  nextCellValue: string
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
    
    // Get the sheet cell
    const sheetCell = allSheetCells[cellId]

    // Get the current sheet selections
    const sheetSelections = allSheets[sheetId].selections
    
    // Create the new label
    const newSheetCellLabel: ISheetLabel = {
      id: createUuid(),
      sheetId: sheetId,
      columnId: sheetCell.columnId,
      rowId: sheetCell.rowId,
      cellId: cellId,
      value: labelValue || ''
    }

    // Next All Sheet Cells
    const nextAllSheetCells = {
      ...allSheetCells,
      [cellId]: {
        ...allSheetCells[cellId],
        value: nextCellValue
      }
    }

    // Next All Sheet Labels
    const nextAllSheetLabels = {
      ...allSheetLabels,
      [newSheetCellLabel.id]: newSheetCellLabel
    }

    // Next All Sheet Cell Labels
    const nextAllSheetCellLabels = {
      ...allSheetCellLabels,
      [cellId]: [
        ...(allSheetCellLabels[cellId] || []),
        newSheetCellLabel.id,
      ]
    }

    // Actions
    const actions = (isHistoryStep: boolean = false) => {
      dispatch(setAllSheetLabels(nextAllSheetLabels))    
      dispatch(setAllSheetCellLabels(nextAllSheetCellLabels))
      dispatch(setAllSheetCells(nextAllSheetCells))
      dispatch(setAllSheets({
        ...allSheets,
        [sheetId]: {
          ...allSheets[sheetId],
          selections: sheetSelections
        }
      })) 
      mutation.updateSheetCell(cellId, { value: nextCellValue })
      if(!isHistoryStep) {
        mutation.createSheetCellLabel(newSheetCellLabel)
      }
      else {
        mutation.restoreSheetCellLabel(newSheetCellLabel.id)
      }
    }

    // Undo Actions
    const undoActions = () => { 
      dispatch(setAllSheetCellLabels(allSheetCellLabels))
      dispatch(setAllSheetLabels(allSheetLabels))    
      dispatch(setAllSheetCells({
        ...allSheetCells,
        [cellId]: {
          ...allSheetCells[cellId],
          value: previousCellValue
        }
      }))
      dispatch(setAllSheets({
        ...allSheets,
        [sheetId]: {
          ...allSheets[sheetId],
          selections: sheetSelections
        }
      })) 
      mutation.updateSheetCell(cellId, { value: previousCellValue })
      mutation.deleteSheetCellLabel(newSheetCellLabel.id)
    }

    // Create the history step
    dispatch(createHistoryStep({ actions, undoActions }))

    // Call the actions
    actions()
  }
}