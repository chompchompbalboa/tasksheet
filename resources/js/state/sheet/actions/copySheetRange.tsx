//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet } from '@/state/sheet/types'

import { updateSheetClipboard } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Copy Sheet Range
//-----------------------------------------------------------------------------
export const copySheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets: {
        [sheetId]: {
          activeSheetViewId,
          selections: {
            rangeCellIds,
            rangeStartColumnId,
            rangeStartRowId,
            rangeStartCellId,
            rangeEndColumnId,
            rangeEndRowId,
            rangeEndCellId,
          },
          visibleRows
        }
      },
      allSheetViews
    } = getState().sheet

    const activeSheetView = allSheetViews[activeSheetViewId]

    dispatch(updateSheetClipboard({
      sheetId: sheetId,
      cutOrCopy: 'COPY',
      selections: {
          rangeCellIds,
          rangeStartColumnId,
          rangeStartRowId,
          rangeStartCellId,
          rangeEndColumnId,
          rangeEndRowId,
          rangeEndCellId,
          visibleColumns: activeSheetView.visibleColumns,
          visibleRows
      }
    }))
    
  }
}