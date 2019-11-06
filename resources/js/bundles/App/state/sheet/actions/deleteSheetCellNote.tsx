//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetCell, ISheetNote } from '@app/state/sheet/types'
import { 
  setAllSheetCellNotes
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Delete Sheet CellNote
//-----------------------------------------------------------------------------
export const deleteSheetCellNote = (sheetCellId: ISheetCell['id'], sheetCellNoteId: ISheetNote['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      sheet: {
        allSheetCellNotes
      }
    } = getState()
    
    const nextAllSheetCellNotes = {
      ...allSheetCellNotes,
      [sheetCellId]: allSheetCellNotes[sheetCellId].filter(currentSheetCellNoteId => currentSheetCellNoteId !== sheetCellNoteId)
    }
    
    dispatch(setAllSheetCellNotes(nextAllSheetCellNotes))
    
    mutation.deleteSheetCellNote(sheetCellNoteId)
  }
}