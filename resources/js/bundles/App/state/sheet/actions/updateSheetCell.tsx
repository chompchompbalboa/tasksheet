//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCellUpdates } from '@app/state/sheet/types'

import { updateSheetCellReducer } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Column Break
//-----------------------------------------------------------------------------
export const updateSheetCell = (cellId: string, updates: ISheetCellUpdates, undoUpdates: ISheetCellUpdates = null, skipDatabaseUpdate: boolean = false): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    const removeAppPropertiesFromCellUpdates = (updates: ISheetCellUpdates) => {
      const {
        isCellEditing,
        isCellSelectedSheetIds,
        ...remainingUpdates
      } = updates
      return remainingUpdates
    }
    const updatesForHistoryAction = removeAppPropertiesFromCellUpdates(updates)
    const undoUpdatesForHistoryAction = undoUpdates ? removeAppPropertiesFromCellUpdates(undoUpdates) : null
    const actions = (isHistoryAction: boolean = false) => {
      dispatch(updateSheetCellReducer(cellId, isHistoryAction ? updatesForHistoryAction : updates))
      !skipDatabaseUpdate && mutation.updateSheetCell(cellId, updates)
    }
    const undoActions = () => {
      dispatch(updateSheetCellReducer(cellId, undoUpdatesForHistoryAction))
      !skipDatabaseUpdate && mutation.updateSheetCell(cellId, undoUpdatesForHistoryAction)
    }
    undoUpdates !== null && dispatch(createHistoryStep({actions, undoActions }))
    actions()
	}
}