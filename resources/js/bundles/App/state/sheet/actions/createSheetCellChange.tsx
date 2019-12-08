//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetCell, ISheetChange } from '@app/state/sheet/types'
import { 
  setAllSheetCellChanges,
  setAllSheetChanges
} from '@app/state/sheet/actions'

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
        allSheetCells,
        allSheetCellChanges,
        allSheetChanges
      },
      user: {
        name: userName
      }
    } = getState()
    
    const sheetCell = allSheetCells[cellId]

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