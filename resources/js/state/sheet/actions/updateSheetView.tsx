//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetViewUpdates } from '@/state/sheet/types'

import { 
  updateSheetViewReducer 
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const updateSheetView = (sheetViewId: string, updates: ISheetViewUpdates, skipDatabaseUpdate: boolean = false): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetViewReducer(sheetViewId, updates))
    !skipDatabaseUpdate && mutation.updateSheetView(sheetViewId, updates)
	}
}