//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetFilterUpdates } from '@app/state/sheet/types'

import { 
  clearSheetSelection, 
  updateSheetFilterReducer 
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Filter
//-----------------------------------------------------------------------------
export const updateSheetFilter = (sheetId: ISheet['id'], filterId: string, updates: ISheetFilterUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(clearSheetSelection(sheetId))
    dispatch(updateSheetFilterReducer(filterId, updates))
	}
}