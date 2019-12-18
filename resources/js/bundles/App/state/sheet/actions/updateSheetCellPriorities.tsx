//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import _ from 'lodash'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetPriority, ISheetCellPriority } from '@app/state/sheet/types'

import { IAppState } from '@app/state'

import { createHistoryStep } from '@app/state/history/actions'
import { 
  updateSheet,
  updateSheetStyles
} from '@app/state/sheet/actions'

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

    const selectedCellId = sheetSelections.rangeStartCellId

    let nextSheetCellPriorities = { ...sheetCellPriorities }
    const newSheetCellPrioritiesToDatabase: ISheetCellPriority[] = []
    const newSheetCellPrioritiesIds: ISheetCellPriority['id'][] = []
      
    const nextSheetStylesBackgroundColor = new Set(sheetStyles.backgroundColor)
    const nextSheetStylesBackgroundColorReference = { ...sheetStyles.backgroundColorReference }
    const nextSheetStylesColor = new Set(sheetStyles.color)
    const nextSheetStylesColorReference = { ...sheetStyles.colorReference }
    
    let actions: () => void, undoActions: () => void

    if(sheetPriorityId) {

      const sheetPriority = allSheetPriorities[sheetPriorityId]
  
      // Selected cell
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
  
      // Selected range
      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        if(sheetCellId !== selectedCellId) {
          // Priorities
          const newSheetCellPriority: ISheetCellPriority = {
            id: nextSheetCellPriorities[sheetCellId] ? nextSheetCellPriorities[sheetCellId].id : createUuid(),
            sheetId: sheetId,
            cellId: sheetCellId,
            priorityId: sheetPriorityId
          }
          nextSheetCellPriorities[sheetCellId] = newSheetCellPriority
          newSheetCellPrioritiesToDatabase.push(newSheetCellPriority)
          newSheetCellPrioritiesIds.push(newSheetCellPriority.id)
          // Sheet Styles
          nextSheetStylesBackgroundColor.add(sheetCellId)
          nextSheetStylesBackgroundColorReference[sheetCellId] = sheetPriority.backgroundColor
          nextSheetStylesColor.add(sheetCellId)
          nextSheetStylesColorReference[sheetCellId] = sheetPriority.color
        }
      })
      
      actions = () => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: nextSheetCellPriorities
        }, true))

        dispatch(updateSheetStyles(sheetId, {
          ...sheetStyles,
          backgroundColor: nextSheetStylesBackgroundColor,
          backgroundColorReference: nextSheetStylesBackgroundColorReference
        }, true))

        mutation.createSheetCellPriorities(newSheetCellPrioritiesToDatabase)
      }
      
      undoActions = () => {
        dispatch(updateSheet(sheetId, {
          cellPriorities: sheetCellPriorities
        }, true))

        dispatch(updateSheetStyles(sheetId, sheetStyles, true))

        mutation.deleteSheetCellPriorities(newSheetCellPrioritiesIds)
      }
    }
    else {

      const deletedSheetCellPriorities: ISheetCellPriority[] = []
      const sheetCellPriorityIdsToDelete: ISheetCellPriority['id'][] = []
      
      nextSheetStylesBackgroundColor.delete(selectedCellId)
      nextSheetStylesColor.delete(selectedCellId)
      
      if(sheetCellPriorities[selectedCellId]) {
        const sheetCellPriority = sheetCellPriorities[selectedCellId]
        nextSheetCellPriorities = _.omit(nextSheetCellPriorities, selectedCellId)
        sheetCellPriorityIdsToDelete.push(sheetCellPriority.id)
        deletedSheetCellPriorities.push(sheetCellPriority)
      }

      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        if(sheetCellId !== selectedCellId) {
          nextSheetStylesBackgroundColor.delete(sheetCellId)
          nextSheetStylesColor.delete(sheetCellId)
          if(sheetCellPriorities[sheetCellId]) {
            const sheetCellPriority = sheetCellPriorities[selectedCellId]
            nextSheetCellPriorities = _.omit(nextSheetCellPriorities, sheetCellId)
            sheetCellPriorityIdsToDelete.push(sheetCellPriority.id)
            deletedSheetCellPriorities.push(sheetCellPriority)
          }
        }
      })
      
      actions = () => {
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
      
      undoActions = () => {
        console.log('undoDeleteSheetCellPriority')
        dispatch(updateSheet(sheetId, {
          cellPriorities: sheetCellPriorities
        }, true))

        dispatch(updateSheetStyles(sheetId, sheetStyles, true))
        
        mutation.createSheetCellPriorities(deletedSheetCellPriorities)
      }
    }

    dispatch(createHistoryStep({actions, undoActions}))
    
    actions()

	}
}