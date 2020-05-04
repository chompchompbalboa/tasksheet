//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet, 
  ISheetColumn, 
  ISheetGantt,
  ISheetGanttRange
} from '@/state/sheet/types'
import { 
  setAllSheetGanttRanges,
  updateSheet,
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Gantt Range
//-----------------------------------------------------------------------------
export const createSheetGanttRange = (
  sheetId: ISheet['id'],
  sheetGanttId: ISheetGantt['id'],
  startDateColumnId: ISheetColumn['id'],
  endDateColumnId: ISheetColumn['id']
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetGantts,
      allSheetGanttRanges
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const sheetGantt = allSheetGantts[sheetGanttId]

    const newSheetGanttRange: ISheetGanttRange = {
      id: createUuid(),
      sheetId: sheetId,
      columnId: sheetGantt.columnId,
      sheetGanttId: sheetGanttId,
      startDateColumnId: startDateColumnId,
      endDateColumnId: endDateColumnId,
      backgroundColor: null
    }

    const nextSheetGanttRanges = { 
      ...sheet.ganttRanges, 
      [sheetGanttId]: [ ...(sheet.ganttRanges[sheetGanttId] || []), newSheetGanttRange.id ]
    }

    dispatch(setAllSheetGanttRanges({
      ...allSheetGanttRanges,
      [newSheetGanttRange.id]: newSheetGanttRange
    }))
    dispatch(updateSheet(sheetId, { 
      ganttRanges: nextSheetGanttRanges 
    }, true))

    mutation.createSheetGanttRanges([ newSheetGanttRange ])
  }
}