//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetGanttRange, ISheetGanttRangeUpdates } from '@/state/sheet/types'

import { createHistoryStep } from '@/state/history/actions'
import { 
  updateSheetGanttRangeReducer 
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Update Sheet Gantt Range
//-----------------------------------------------------------------------------
export const updateSheetGanttRange = (
  sheetGanttRangeId: ISheetGanttRange['id'], 
  updates: ISheetGanttRangeUpdates, 
  undoUpdates: ISheetGanttRangeUpdates
): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {

    const actions = () => {
      dispatch(updateSheetGanttRangeReducer(sheetGanttRangeId, updates))
      mutation.updateSheetGanttRange(sheetGanttRangeId, updates)
    }

    const undoActions = () => {
      dispatch(updateSheetGanttRangeReducer(sheetGanttRangeId, undoUpdates))
      mutation.updateSheetGanttRange(sheetGanttRangeId, undoUpdates)
    }

    dispatch(createHistoryStep({ actions, undoActions }))
    actions()

	}
}