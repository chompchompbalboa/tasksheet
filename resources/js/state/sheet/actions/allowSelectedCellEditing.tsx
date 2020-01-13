//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet } from '@/state/sheet/types'

import { updateSheet } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const allowSelectedCellEditing = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets
    } = getState().sheet
    if(allSheets) {
      const {
        selections
      } = allSheets[sheetId]
      dispatch(updateSheet(sheetId, {
        selections: {
          ...selections,
          isSelectedCellEditingPrevented: false
        }
      }, true))

    }
  }
}