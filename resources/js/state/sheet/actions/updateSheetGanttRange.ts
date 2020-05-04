//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet,
  ISheetColumn,
  ISheetGanttRange,
  ISheetGanttRangeUpdates 
} from '@/state/sheet/types'

import { 
  updateSheet,
  updateSheetGanttRangeReducer 
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Update Sheet Gantt Range
//-----------------------------------------------------------------------------
export const updateSheetGanttRange = (
  sheetId: ISheet['id'],
  columnId: ISheetColumn['id'],
  sheetGanttRangeId: ISheetGanttRange['id'], 
  updates: ISheetGanttRangeUpdates
): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetGanttRanges
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const sheetGanttRange = allSheetGanttRanges[sheetGanttRangeId]

    let sheetGanttRangeIdsToDelete: ISheetGanttRange['id'][] = []

    Object.keys(allSheetGanttRanges).forEach(currentSheetGanttRangeId => {
      const currentSheetGanttRange = allSheetGanttRanges[currentSheetGanttRangeId]
      if(currentSheetGanttRange.sheetId === sheetGanttRange.sheetId
        && currentSheetGanttRange.columnId === currentSheetGanttRange.columnId
        && (currentSheetGanttRange.startDateColumnId === updates.startDateColumnId || currentSheetGanttRange.startDateColumnId === updates.endDateColumnId)
        ) {
          sheetGanttRangeIdsToDelete.push(currentSheetGanttRangeId)
        }
    })

    const nextSheetGanttRanges = {
      ...sheet.ganttRanges,
      [sheetGanttRange.sheetGanttId]: sheet.ganttRanges[sheetGanttRange.sheetGanttId].filter(currentSheetGanttRangeId => !sheetGanttRangeIdsToDelete.includes(currentSheetGanttRangeId))
    }

    
    const actions = () => {
      dispatch(updateSheet(sheetId, { ganttRanges: nextSheetGanttRanges }, true))
      dispatch(updateSheetGanttRangeReducer(sheetGanttRangeId, updates))
      mutation.updateSheetGanttRange(sheetGanttRangeId, updates)
      mutation.deleteSheetGanttRanges(sheetGanttRangeIdsToDelete)
    }
    const undoActions = () => {
    }
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}