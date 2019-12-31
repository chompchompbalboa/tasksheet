//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetPriority } from '@/state/sheet/types'
import { 
  setAllSheetPriorities,
  updateSheet
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Priority
//-----------------------------------------------------------------------------
export const createSheetPriority = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets: {
        [sheetId]: sheet
      },
      allSheetPriorities
    } = getState().sheet

    let newSheetPriorityOrder = 0
    sheet.priorities.forEach(sheetPriorityId => {
      if(allSheetPriorities[sheetPriorityId] && (Number(allSheetPriorities[sheetPriorityId].order) + 1) > newSheetPriorityOrder) {
        newSheetPriorityOrder = Number(allSheetPriorities[sheetPriorityId].order) + 1
      }
    })

    const newSheetPriority: ISheetPriority = {
      id: createUuid(),
      sheetId: sheetId,
      name: null,
      backgroundColor: 'transparent',
      color: 'black',
      order: newSheetPriorityOrder
    }

    dispatch(setAllSheetPriorities({
      ...allSheetPriorities,
      [newSheetPriority.id]: newSheetPriority
    }))

    dispatch(updateSheet(sheetId, {
      priorities: [ ...sheet.priorities, newSheetPriority.id ]
    }, true))

    mutation.createSheetPriority(newSheetPriority)
  }
}