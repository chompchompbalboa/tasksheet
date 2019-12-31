//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetCellUpdates } from '@/state/sheet/types'

import { updateSheetCellReducer } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Cell
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