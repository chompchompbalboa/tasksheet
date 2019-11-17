//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import _ from 'lodash'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetPriority, ISheetCellPriority } from '@app/state/sheet/types'

import { IAppState } from '@app/state'

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
    const sheetCellPrioritiesToDatabase: ISheetCellPriority[] = []
      
    const nextSheetStylesBackgroundColor = new Set(sheetStyles.backgroundColor)
    const nextSheetStylesBackgroundColorReference = { ...sheetStyles.backgroundColorReference }
    const nextSheetStylesColor = new Set(sheetStyles.color)
    const nextSheetStylesColorReference = { ...sheetStyles.colorReference }

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
      sheetCellPrioritiesToDatabase.push(newSheetCellPriority)

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
          sheetCellPrioritiesToDatabase.push(newSheetCellPriority)
          // Sheet Styles
          nextSheetStylesBackgroundColor.add(sheetCellId)
          nextSheetStylesBackgroundColorReference[sheetCellId] = sheetPriority.backgroundColor
          nextSheetStylesColor.add(sheetCellId)
          nextSheetStylesColorReference[sheetCellId] = sheetPriority.color
        }
      })
  
      dispatch(updateSheet(sheetId, {
        cellPriorities: nextSheetCellPriorities
      }))

      dispatch(updateSheetStyles(sheetId, {
        ...sheetStyles,
        backgroundColor: nextSheetStylesBackgroundColor,
        backgroundColorReference: nextSheetStylesBackgroundColorReference
      }))

      mutation.createSheetCellPriorities(sheetCellPrioritiesToDatabase)
    }
    else {

      const sheetCellPriorityIdsToDelete: ISheetCellPriority['id'][] = []
      nextSheetStylesBackgroundColor.delete(selectedCellId)
      nextSheetStylesColor.delete(selectedCellId)
      if(sheetCellPriorities[selectedCellId]) {
        nextSheetCellPriorities = _.omit(nextSheetCellPriorities, selectedCellId)
        sheetCellPriorityIdsToDelete.push(sheetCellPriorities[selectedCellId].id)
      }

      sheetSelections.rangeCellIds.forEach(sheetCellId => {
        if(sheetCellId !== selectedCellId) {
          nextSheetStylesBackgroundColor.delete(sheetCellId)
          nextSheetStylesColor.delete(sheetCellId)
          if(sheetCellPriorities[sheetCellId]) {
            nextSheetCellPriorities = _.omit(nextSheetCellPriorities, sheetCellId)
            sheetCellPriorityIdsToDelete.push(sheetCellPriorities[sheetCellId].id)
          }
        }
      })
  
      dispatch(updateSheet(sheetId, {
        cellPriorities: nextSheetCellPriorities
      }, true))
  
      dispatch(updateSheetStyles(sheetId, {
        ...sheetStyles,
        backgroundColor: nextSheetStylesBackgroundColor,
        backgroundColorReference: nextSheetStylesBackgroundColorReference
      }))
      mutation.deleteSheetCellPriorities(sheetCellPriorityIdsToDelete)
    }

	}
}