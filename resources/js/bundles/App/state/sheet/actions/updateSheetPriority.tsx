//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetPriority, ISheetPriorityUpdates } from '@app/state/sheet/types'

import { 
  updateSheetPriorityReducer 
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Priority
//-----------------------------------------------------------------------------
export const updateSheetPriority = (sheetPriorityId: ISheetPriority['id'], updates: ISheetPriorityUpdates, skipDatabaseUpdate: boolean = false): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetPriorityReducer(sheetPriorityId, updates))
    !skipDatabaseUpdate && mutation.updateSheetPriority(sheetPriorityId, updates)
	}
}