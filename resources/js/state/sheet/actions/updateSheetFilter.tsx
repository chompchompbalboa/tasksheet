//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetFilterUpdates } from '@/state/sheet/types'

import { 
  clearSheetSelection, 
  updateSheetFilterReducer 
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Filter
//-----------------------------------------------------------------------------
export const updateSheetFilter = (sheetId: ISheet['id'], filterId: string, updates: ISheetFilterUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(clearSheetSelection(sheetId))
    dispatch(updateSheetFilterReducer(filterId, updates))
	}
}