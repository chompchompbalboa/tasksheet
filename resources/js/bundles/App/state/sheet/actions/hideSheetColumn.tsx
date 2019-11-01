//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheet } from '@app/state/sheet/types'

import { updateSheet, updateSheetView } from '@app/state/sheet/actions'
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
    const visibleColumns = activeSheetView.visibleColumns || sheet.visibleColumns

    const nextSheetViewVisibleColumns = visibleColumns.filter((_, index) => index !== columnVisibleColumnsIndex)

    const actions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: nextSheetViewVisibleColumns }, true))
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: nextSheetViewVisibleColumns }))
    }

    const undoActions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: visibleColumns }, true))
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: activeSheetView.visibleColumns }))
    }

    dispatch(createHistoryStep({ actions, undoActions }))

    actions()
  }
}