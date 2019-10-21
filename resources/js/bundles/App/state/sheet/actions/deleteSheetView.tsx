//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { 
  setAllSheetViews,
  updateSheet 
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetView = (sheetId: string, sheetViewId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetViews,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const { [sheetViewId]: deletedView, ...nextAllSheetViews } = allSheetViews
    const nextSheetViews = sheet.views.filter(currentSheetViewId => currentSheetViewId !== sheetViewId)
    batch(() => {
      dispatch(setAllSheetViews(nextAllSheetViews))
      dispatch(updateSheet(sheetId, {
        views: nextSheetViews
      }, true))
    })
    mutation.deleteSheetView(sheetViewId)
	}
}