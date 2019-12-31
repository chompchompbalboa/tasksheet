//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetPriority, ISheetPriorityUpdates } from '@/state/sheet/types'

import { 
  updateSheetPriorityReducer 
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Priority
//-----------------------------------------------------------------------------
export const updateSheetPriority = (sheetPriorityId: ISheetPriority['id'], updates: ISheetPriorityUpdates, skipDatabaseUpdate: boolean = false): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetPriorityReducer(sheetPriorityId, updates))
    !skipDatabaseUpdate && mutation.updateSheetPriority(sheetPriorityId, updates)
	}
}