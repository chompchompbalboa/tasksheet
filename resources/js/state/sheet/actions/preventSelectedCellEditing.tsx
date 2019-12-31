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
export const preventSelectedCellEditing = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: { 
          selections
        }
      }
    } = getState().sheet
    dispatch(updateSheet(sheetId, {
      selections: {
        ...selections,
        isSelectedCellEditingPrevented: true
      }
    }, true))
  }
}