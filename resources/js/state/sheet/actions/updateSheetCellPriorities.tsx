//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import _ from 'lodash'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetPriority, ISheetCellPriority } from '@/state/sheet/types'

import { IAppState } from '@/state'

import { createHistoryStep } from '@/state/history/actions'
import { 
  updateSheet
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Priority
//-----------------------------------------------------------------------------
export const updateSheetCellPriorities = (sheetId: ISheet['id'], sheetPriorityId: ISheetPriority['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          cellPriorities: sheetCellPriorities,
          selections: sheetSelections
        }
      }
    } = getState().sheet

    // Variables
    const selectedCellId = sheetSelections.rangeStartCellId
    let nextSheetCellPriorities = { ...sheetCellPriorities }
    const newSheetCellPrioritiesToDatabase: ISheetCellPriority[] = []
    const newSheetCellPrioritiesIds: ISheetCellPriority['id'][] = []

    // If we are adding priority to the selected cells
    if(sheetPriorityId) {
  
      // Assign priority to the selected cell, updating the sheet styles as well
      const newSheetCellPriority: ISheetCellPriority = {
        id: nextSheetCellPriorities[selectedCellId] ? nextSheetCellPriorities[selectedCellId].id : createUuid(),
        sheetId: sheetId,
        cellId: selectedCellId,
        priorityId: sheetPriorityId
      }
      nextSheetCellPriorities[selectedCellId] = newSheetCellPriority
      newSheetCellPrioritiesToDatabase.push(newSheetCellPriority)
      newSheetCellPrioritiesIds.push(newSheetCellPriority.id)
  
      // Assign priority to the cells in the selected range
      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        if(sheetCellId !== selectedCellId) { // Skip the currently selected cell since we just assigned priority to it
          // Assign priority to the current cell, updating the sheet styles as well 
          const newSheetCellPriority: ISheetCellPriority = {
            id: nextSheetCellPriorities[sheetCellId] ? nextSheetCellPriorities[sheetCellId].id : createUuid(),
            sheetId: sheetId,
            cellId: sheetCellId,
            priorityId: sheetPriorityId
          }
          nextSheetCellPriorities[sheetCellId] = newSheetCellPriority
          newSheetCellPrioritiesToDatabase.push(newSheetCellPriority)
          newSheetCellPrioritiesIds.push(newSheetCellPriority.id)
        }
      })
      
      // Actions
      const actions = (isHistoryStep: boolean = false) => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: nextSheetCellPriorities
        }, true))
        if(!isHistoryStep) {
          mutation.createSheetCellPriorities(newSheetCellPrioritiesToDatabase)
        }
        else {
          mutation.restoreSheetCellPriorities(newSheetCellPrioritiesIds)
        }
      }
      
      // Undo Actions
      const undoActions = () => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: sheetCellPriorities
        }, true))
        mutation.deleteSheetCellPriorities(newSheetCellPrioritiesIds)
      }

      // Create the history step and call the actions
      dispatch(createHistoryStep({actions, undoActions}))
      actions()
    }

    // If we are removing priority from the selected cells
    else {

      // Variables
      const deletedSheetCellPriorities: ISheetCellPriority[] = []
      const sheetCellPriorityIdsToDelete: ISheetCellPriority['id'][] = []
      
      // If the selected cell has priority, remove it
      if(sheetCellPriorities[selectedCellId]) {
        const sheetCellPriority = sheetCellPriorities[selectedCellId]
        nextSheetCellPriorities = _.omit(nextSheetCellPriorities, selectedCellId)
        sheetCellPriorityIdsToDelete.push(sheetCellPriority.id)
        deletedSheetCellPriorities.push(sheetCellPriority)
      }

      // Remove priority from cells in the range
      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        if(sheetCellId !== selectedCellId) {
          if(sheetCellPriorities[sheetCellId]) {
            const sheetCellPriority = sheetCellPriorities[sheetCellId]
            nextSheetCellPriorities = _.omit(nextSheetCellPriorities, sheetCellId)
            sheetCellPriorityIdsToDelete.push(sheetCellPriority.id)
            deletedSheetCellPriorities.push(sheetCellPriority)
          }
        }
      })
      
      // Actions
      const actions = () => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: nextSheetCellPriorities
        }, true))
        mutation.deleteSheetCellPriorities(sheetCellPriorityIdsToDelete)
      }
      
      // Undo Actions
      const undoActions = () => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: sheetCellPriorities
        }, true))
        mutation.restoreSheetCellPriorities(sheetCellPriorityIdsToDelete)
      }

      // Create the history step and call the actions
      dispatch(createHistoryStep({actions, undoActions}))
      actions()
    }

	}
}