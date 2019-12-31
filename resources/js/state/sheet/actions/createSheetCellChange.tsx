//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetCell, ISheetChange } from '@/state/sheet/types'
import { 
  setAllSheetCellChanges,
  setAllSheetChanges
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet CellChange
//-----------------------------------------------------------------------------
export const createSheetCellChange = (
  sheetId: ISheet['id'], 
  cellId: ISheetCell['id'],
  value: string
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetColumns,
        allSheetCells,
        allSheetCellChanges,
        allSheetChanges
      },
      user: {
        name: userName
      }
    } = getState()
    
    const sheetCell = allSheetCells[cellId]
    const sheetColumn = allSheetColumns[sheetCell.columnId]
    
    if(sheetColumn.trackCellChanges) {
      const newSheetCellChange: ISheetChange = {
        id: createUuid(),
        sheetId: sheetId,
        columnId: sheetCell.columnId,
        rowId: sheetCell.rowId,
        cellId: cellId,
        value: value,
        createdBy: userName,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }

      const nextAllSheetChanges = {
        ...allSheetChanges,
        [newSheetCellChange.id]: newSheetCellChange
      }

      const nextAllSheetCellChanges = {
        ...allSheetCellChanges,
        [cellId]: [
          newSheetCellChange.id,
          ...(allSheetCellChanges[cellId] || [])
        ]
      }

      dispatch(setAllSheetChanges(nextAllSheetChanges))    
      dispatch(setAllSheetCellChanges(nextAllSheetCellChanges))

      mutation.createSheetCellChange(newSheetCellChange)
    }
  }
}