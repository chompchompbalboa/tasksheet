//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { updateSheetView } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Column Break
//-----------------------------------------------------------------------------
export const deleteSheetColumnBreak = (sheetId: string, columnBreakIndex: number): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetViews
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    
    const nextSheetViewVisibleColumns = activeSheetView.visibleColumns.filter((_, index) => index !== columnBreakIndex)
    
    const actions = () => {
      batch(() => {
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: nextSheetViewVisibleColumns
        }))
      })
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(updateSheetView(activeSheetView.id, {
          visibleColumns: activeSheetView.visibleColumns
        }))
      })
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}