//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { ISheet } from '@/state/sheet/types'

import { updateSheetView } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Hide Sheet Column
//-----------------------------------------------------------------------------
export const hideSheetColumns = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetViews
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const nextSheetViewVisibleColumns = activeSheetView.visibleColumns.filter(columnId => !sheet.selections.rangeColumnIds.has(columnId))

    const actions = () => {
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: nextSheetViewVisibleColumns }))
    }

    const undoActions = () => {
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: activeSheetView.visibleColumns }))
    }

    dispatch(createHistoryStep({ actions, undoActions }))

    actions()
  }
}