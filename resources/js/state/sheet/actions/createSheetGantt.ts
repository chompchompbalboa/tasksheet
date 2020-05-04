//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

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
  setAllSheetGantts,
  setAllSheetGanttRanges,
  updateSheet,
  updateSheetColumn
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Gantt
//-----------------------------------------------------------------------------
export const createSheetGantt = (
  sheetId: ISheet['id'],
  columnId: ISheetColumn['id']
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetColumns,
      allSheetGantts,
      allSheetGanttRanges
    } = getState().sheet

    const sheet = allSheets[sheetId]

    let nextAllSheetGanttRanges = clone(allSheetGanttRanges)
    let nextSheetGanttRanges = clone(sheet.ganttRanges)
    let newSheetGanttRanges: ISheetGanttRange[] = []

    const newSheetGantt: ISheetGantt = {
      id: createUuid(),
      sheetId: sheetId,
      columnId: columnId,
      startDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      endDate: moment().add(28, 'days').format('YYYY-MM-DD HH:mm:ss')
    }

    const nextSheetGantts = { 
      ...sheet.gantts, 
      [columnId]: newSheetGantt.id 
    }

    nextSheetGanttRanges[newSheetGantt.id] = []
    sheet.columns.forEach(sheetColumnId => {
      const sheetColumn = allSheetColumns[sheetColumnId]
      if(sheetColumn.cellType === 'DATETIME') {
        const newSheetGanttRange: ISheetGanttRange = {
          id: createUuid(),
          sheetId: sheetId,
          columnId: columnId,
          sheetGanttId: newSheetGantt.id,
          startDateColumnId: sheetColumn.id,
          endDateColumnId: null,
          backgroundColor: null
        }
        newSheetGanttRanges.push(newSheetGanttRange)
        nextAllSheetGanttRanges[newSheetGanttRange.id] = newSheetGanttRange
        nextSheetGanttRanges[newSheetGantt.id].push(newSheetGanttRange.id)
      }
    })

    dispatch(setAllSheetGantts({
      ...allSheetGantts,
      [newSheetGantt.id]: newSheetGantt
    }))

    dispatch(setAllSheetGanttRanges(nextAllSheetGanttRanges))
    dispatch(updateSheet(sheetId, { 
      gantts: nextSheetGantts,
      ganttRanges: nextSheetGanttRanges 
    }, true))
    dispatch(updateSheetColumn(columnId, { cellType: 'GANTT' }))

    mutation.createSheetGantt(newSheetGantt, newSheetGanttRanges)
  }
}