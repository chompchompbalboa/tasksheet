//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetViewUpdates } from '@/state/sheet/types'

import { 
  updateSheetViewReducer 
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const updateSheetView = (
  sheetViewId: string, 
  updates: ISheetViewUpdates, 
  skipDatabaseUpdate: boolean = false,
  doCreateHistoryStep: boolean = false
): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetViews: {
        [sheetViewId]: sheetView
      }
    } = getState().sheet

    if(!doCreateHistoryStep) {
      dispatch(updateSheetViewReducer(sheetViewId, updates))
      !skipDatabaseUpdate && mutation.updateSheetView(sheetViewId, updates)
    }
    else {
      const actions = () => {
        dispatch(updateSheetViewReducer(sheetViewId, updates))
        !skipDatabaseUpdate && mutation.updateSheetView(sheetViewId, updates)
      }
      const undoActions = () => {
        dispatch(updateSheetViewReducer(sheetViewId, sheetView))
        !skipDatabaseUpdate && mutation.updateSheetView(sheetViewId, sheetView)
      }
      dispatch(createHistoryStep({ actions, undoActions }))
      actions()
    }
	}
}