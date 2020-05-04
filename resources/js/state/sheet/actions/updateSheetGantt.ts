//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetGanttUpdates } from '@/state/sheet/types'

import { updateSheetGanttReducer } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Gantt
//-----------------------------------------------------------------------------
export const updateSheetGantt = (sheetGanttId: string, updates: ISheetGanttUpdates, undoUpdates: ISheetGanttUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    const actions = () => {
      dispatch(updateSheetGanttReducer(sheetGanttId, updates))
      setTimeout(() => mutation.updateSheetGantt(sheetGanttId, updates), 10)
    }
    const undoActions = () => {
      dispatch(updateSheetGanttReducer(sheetGanttId, undoUpdates))
      setTimeout(() => mutation.updateSheetGantt(sheetGanttId, undoUpdates), 10)
    }
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}