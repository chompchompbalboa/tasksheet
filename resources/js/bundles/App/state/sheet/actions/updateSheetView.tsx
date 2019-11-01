//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetViewUpdates } from '@app/state/sheet/types'

import { 
  updateSheetViewReducer 
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const updateSheetView = (sheetViewId: string, updates: ISheetViewUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetViewReducer(sheetViewId, updates))
    mutation.updateSheetView(sheetViewId, updates)
	}
}