//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetColumnUpdates } from '@app/state/sheet/types'

import { updateSheetColumnReducer } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const updateSheetColumn = (columnId: string, updates: ISheetColumnUpdates, undoUpdates?: ISheetColumnUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    const actions = () => {
      dispatch(updateSheetColumnReducer(columnId, updates))
      mutation.updateSheetColumn(columnId, updates)
    }
    const undoActions = () => {
      dispatch(updateSheetColumnReducer(columnId, undoUpdates))
      mutation.updateSheetColumn(columnId, undoUpdates)
    }
    undoUpdates && dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}