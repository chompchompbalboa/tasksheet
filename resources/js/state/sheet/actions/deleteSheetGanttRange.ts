//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet,
  ISheetColumn, 
  ISheetChange 
} from '@/state/sheet/types'

import {
  createHistoryStep
} from '@/state/history/actions'
import { 
  setAllSheetGanttRanges,
  updateSheet
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Gantt Range
//-----------------------------------------------------------------------------
export const deleteSheetGanttRange = (
  sheetId: ISheet['id'], 
  columnId: ISheetColumn['id'],
  sheetGanttRangeId: ISheetChange['id']
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheets: {
          [sheetId]: sheet
        },
        allSheetGanttRanges
      }
    } = getState()

    const { [sheetGanttRangeId]: sheetGanttRangeToDelete, ...nextAllSheetGanttRanges } = allSheetGanttRanges
    const nextSheetGanttRanges = {
      ...sheet.ganttRanges,
      [sheetGanttRangeToDelete.sheetGanttId]: sheet.ganttRanges[sheetGanttRangeToDelete.sheetGanttId].filter(currentSheetGanttRangeId => currentSheetGanttRangeId !== sheetGanttRangeId)
    }

    const actions = () => {
      dispatch(updateSheet(sheetId, { ganttRanges: nextSheetGanttRanges }))
      dispatch(setAllSheetGanttRanges(nextAllSheetGanttRanges))
      mutation.deleteSheetGanttRanges([ sheetGanttRangeId ])
    }

    const undoActions = () => {
      dispatch(setAllSheetGanttRanges(allSheetGanttRanges))
      dispatch(updateSheet(sheetId, { ganttRanges: sheet.ganttRanges }))
      mutation.restoreSheetGanttRanges([ sheetGanttRangeId ])
    }

    dispatch(createHistoryStep({ actions, undoActions }))

    actions()
  }
}