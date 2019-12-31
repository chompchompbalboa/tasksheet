//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet } from '@/state/sheet/types'

import { updateSheet, updateSheetCellReducer } from '@/state/sheet/actions'

import { defaultSheetSelections } from '@/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const clearSheetSelection = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheetCells,
      allSheets: {
        [sheetId]: { 
          selections: {
            rangeStartCellId
          }
        }
      }
    } = getState().sheet

    const rangeStartCell = allSheetCells[rangeStartCellId]
    const nextRangeStartCellIsCellSelectedSheetIds = rangeStartCell ? new Set([ ...rangeStartCell.isCellSelectedSheetIds ]) : new Set() as Set<string>
    nextRangeStartCellIsCellSelectedSheetIds.delete(sheetId)

    batch(() => {
      dispatch(updateSheet(sheetId, { selections: defaultSheetSelections }, true))

      rangeStartCellId !== null && dispatch(updateSheetCellReducer(rangeStartCellId, {
        isCellSelectedSheetIds: nextRangeStartCellIsCellSelectedSheetIds
      }))
    })
  }
}