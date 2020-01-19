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
  updateSheet,
  updateSheetStyles
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
          selections: sheetSelections,
          styles: sheetStyles
        }
      },
      allSheetPriorities
    } = getState().sheet

    // Variables
    const selectedCellId = sheetSelections.rangeStartCellId
    let nextSheetCellPriorities = { ...sheetCellPriorities }
    const newSheetCellPrioritiesToDatabase: ISheetCellPriority[] = []
    const newSheetCellPrioritiesIds: ISheetCellPriority['id'][] = []
    const nextSheetStylesBackgroundColor = new Set(sheetStyles.backgroundColor)
    const nextSheetStylesBackgroundColorReference = { ...sheetStyles.backgroundColorReference }
    const nextSheetStylesColor = new Set(sheetStyles.color)
    const nextSheetStylesColorReference = { ...sheetStyles.colorReference }

    // If we are adding priority to the selected cells
    if(sheetPriorityId) {

      // Get the currently selected sheet priority
      const sheetPriority = allSheetPriorities[sheetPriorityId]
  
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
      nextSheetStylesBackgroundColor.add(selectedCellId)
      nextSheetStylesBackgroundColorReference[selectedCellId] = sheetPriority.backgroundColor
      nextSheetStylesColor.add(selectedCellId)
      nextSheetStylesColorReference[selectedCellId] = sheetPriority.color
  
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
          nextSheetStylesBackgroundColor.add(sheetCellId)
          nextSheetStylesBackgroundColorReference[sheetCellId] = sheetPriority.backgroundColor
          nextSheetStylesColor.add(sheetCellId)
          nextSheetStylesColorReference[sheetCellId] = sheetPriority.color
        }
      })
      
      // Actions
      const actions = (isHistoryStep: boolean = false) => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: nextSheetCellPriorities
        }, true))
        dispatch(updateSheetStyles(sheetId, {
          ...sheetStyles,
          backgroundColor: nextSheetStylesBackgroundColor,
          backgroundColorReference: nextSheetStylesBackgroundColorReference
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
        dispatch(updateSheetStyles(sheetId, sheetStyles, true))
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
      
      // Remove any styles from the selected cell
      nextSheetStylesBackgroundColor.delete(selectedCellId)
      nextSheetStylesColor.delete(selectedCellId)
      
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
          nextSheetStylesBackgroundColor.delete(sheetCellId)
          nextSheetStylesColor.delete(sheetCellId)
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
        dispatch(updateSheetStyles(sheetId, {
          ...sheetStyles,
          backgroundColor: nextSheetStylesBackgroundColor,
          backgroundColorReference: nextSheetStylesBackgroundColorReference
        }, true))
        mutation.deleteSheetCellPriorities(sheetCellPriorityIdsToDelete)
      }
      
      // Undo Actions
      const undoActions = () => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: sheetCellPriorities
        }, true))
        dispatch(updateSheetStyles(sheetId, sheetStyles, true))
        mutation.restoreSheetCellPriorities(sheetCellPriorityIdsToDelete)
      }

      // Create the history step and call the actions
      dispatch(createHistoryStep({actions, undoActions}))
      actions()
    }

	}
}