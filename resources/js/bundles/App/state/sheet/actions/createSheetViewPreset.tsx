//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Create Sheet View Preset
//-----------------------------------------------------------------------------
export const createSheetViewPreset = (sheetId: ISheet['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    false && console.log(dispatch, getState)
    console.log(sheetId)
	}
}