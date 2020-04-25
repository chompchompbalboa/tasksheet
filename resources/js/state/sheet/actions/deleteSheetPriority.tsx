//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { SHEET_PRIORITY_IS_IN_USE } from '@/state/messenger/messages'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetPriority } from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions' 
import { 
  setAllSheetPriorities,
  updateSheet
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Priority
//-----------------------------------------------------------------------------
export const deleteSheetPriority = (sheetId: ISheet['id'], sheetPriorityId: ISheetPriority['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets: {
        [sheetId]: sheet
      },
      allSheetPriorities
    } = getState().sheet

    // Make sure there are no cells using the priority we're trying to delete
    let isSheetPriorityInUse = false
    Object.keys(sheet.cellPriorities).forEach(cellId => {
      const sheetCellPriority = sheet.cellPriorities[cellId]
      console.log(sheetCellPriority.priorityId, sheetPriorityId)
      if(sheetCellPriority) {
        if(sheetCellPriority.priorityId === sheetPriorityId) {
          isSheetPriorityInUse = true
        }
      }
    })

    // If there aren't any cells using the priority
    if(!isSheetPriorityInUse) {

      // Remove the priority from all sheet priorities
      const { [sheetPriorityId]: deletedSheetPriority, ...nextAllSheetPriorities } = allSheetPriorities
  
      // Filter the sheet priorities, removing the priority we're deleting
      const nextSheetPriorities = sheet.priorities.filter(priorityId => priorityId !== sheetPriorityId)
  
      // Update the store
      dispatch(setAllSheetPriorities(nextAllSheetPriorities))
      dispatch(updateSheet(sheetId, {
        priorities: nextSheetPriorities
      }, true))
  
      // Delete from the database
      mutation.deleteSheetPriority(sheetPriorityId)
    }
    // If there are cells using the priority, display an error message
    else {
      dispatch(createMessengerMessage(SHEET_PRIORITY_IS_IN_USE))
    }
  }
}