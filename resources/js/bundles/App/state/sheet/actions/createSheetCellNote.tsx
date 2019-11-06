//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetCell, ISheetNote } from '@app/state/sheet/types'
import { 
  setAllSheetCellNotes,
  setAllSheetNotes
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet CellNote
//-----------------------------------------------------------------------------
export const createSheetCellNote = (sheetId: ISheet['id'], cellId: ISheetCell['id'], value: string): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellNotes,
        allSheetNotes
      },
      user: {
        name: userName
      }
    } = getState()
    
    const newSheetCellNote: ISheetNote = {
      id: createUuid(),
      sheetId: sheetId,
      cellId: cellId,
      value: value,
      createdBy: userName,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    
    const nextAllSheetNotes = {
      ...allSheetNotes,
      [newSheetCellNote.id]: newSheetCellNote
    }
    
    const nextAllSheetCellNotes = {
      ...allSheetCellNotes,
      [cellId]: [
        newSheetCellNote.id,
        ...(allSheetCellNotes[cellId] || [])
      ]
    }
    
    dispatch(setAllSheetNotes(nextAllSheetNotes))    
    dispatch(setAllSheetCellNotes(nextAllSheetCellNotes))
    
    mutation.createSheetCellNote(newSheetCellNote)
  }
}