//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetPriority, ISheetCellPriority } from '@app/state/sheet/types'
import { 
  setAllSheetPriorities,
  updateSheet
} from '@app/state/sheet/actions'

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

    const { [sheetPriorityId]: deletedSheetPriority, ...nextAllSheetPriorities } = allSheetPriorities

    const nextSheetPriorities = sheet.priorities.filter(priorityId => priorityId !== sheetPriorityId)
    
    const nextSheetCellPriorities: { [cellId: string]: ISheetCellPriority } = {}
    Object.keys(sheet.cellPriorities).forEach(cellId => {
      const sheetCellPriority = sheet.cellPriorities[cellId]
      if(sheetCellPriority.id !== sheetPriorityId) {
        nextSheetCellPriorities[cellId] = sheetCellPriority
      }
    })

    dispatch(setAllSheetPriorities(nextAllSheetPriorities))

    dispatch(updateSheet(sheetId, {
      priorities: nextSheetPriorities,
      cellPriorities: nextSheetCellPriorities
    }, true))

    mutation.deleteSheetPriority(sheetPriorityId)
  }
}