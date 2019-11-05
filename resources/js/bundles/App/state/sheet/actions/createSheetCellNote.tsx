//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetNote } from '@app/state/sheet/types'
import { } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet CellNote
//-----------------------------------------------------------------------------
export const createSheetCellNote = (sheetId: string, newNote: ISheetNote): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
    } = getState().sheet
    false && console.log(dispatch)
    false && console.log(allSheets)
    console.log('createSheetCellNote')
  }
}