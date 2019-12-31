//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetColumnUpdates } from '@/state/sheet/types'

import { updateSheetColumnReducer } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const updateSheetColumn = (columnId: string, updates: ISheetColumnUpdates, undoUpdates?: ISheetColumnUpdates, skipDatabaseUpdate: boolean = false): IThunkAction => {
  console.log('updateSheetColumn')
	return async (dispatch: IThunkDispatch) => {
    const actions = () => {
      dispatch(updateSheetColumnReducer(columnId, updates))
      !skipDatabaseUpdate && mutation.updateSheetColumn(columnId, updates)
    }
    const undoActions = () => {
      dispatch(updateSheetColumnReducer(columnId, undoUpdates))
      !skipDatabaseUpdate && mutation.updateSheetColumn(columnId, undoUpdates)
    }
    undoUpdates && dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}