//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheet } from '@app/state/sheet/types'

import { updateSheetView } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Hide Sheet Column
//-----------------------------------------------------------------------------
export const hideSheetColumn = (sheetId: ISheet['id'], columnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetViews
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const nextSheetViewVisibleColumns = activeSheetView.visibleColumns.filter((_, index) => index !== columnVisibleColumnsIndex)

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