//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetPriority, ISheetCellPriority } from '@/state/sheet/types'
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