//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet } from '@app/state/sheet/types'

import { updateSheet } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const preventSelectedCellNavigation = (sheetId: ISheet['id']): IThunkAction => {
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
        isSelectedCellNavigationPrevented: true
      }
    }, true))
  }
}