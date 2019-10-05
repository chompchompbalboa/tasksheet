//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet } from '@app/state/sheet/types'

import { updateSheet, updateSheetCellReducer } from '@app/state/sheet/actions'

import { defaultSheetSelections } from '@app/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const clearSheetSelection = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets: {
        [sheetId]: { 
          selections: {
            rangeStartCellId,
            rangeEndCellId
          }
        }
      }
    } = getState().sheet

    batch(() => {
      dispatch(updateSheet(sheetId, { selections: defaultSheetSelections }, true))

      rangeStartCellId !== null && dispatch(updateSheetCellReducer(rangeStartCellId, {
        isCellSelected: false
      }))

      rangeEndCellId !== null && dispatch(updateSheetCellReducer(rangeEndCellId, {
        isCellSelected: false
      }))
    })
  }
}