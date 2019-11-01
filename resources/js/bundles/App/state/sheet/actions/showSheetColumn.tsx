//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheet, ISheetColumn } from '@app/state/sheet/types'

import { updateSheet, updateSheetView } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Show Sheet Column
//-----------------------------------------------------------------------------
export const showSheetColumn = (sheetId: ISheet['id'], columnVisibleColumnsIndex: number, columnIdToShow: ISheetColumn['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets,
      allSheetViews
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const visibleColumns = activeSheetView.visibleColumns || sheet.visibleColumns
    
    const nextSheetViewVisibleColumns = [
      ...visibleColumns.slice(0, columnVisibleColumnsIndex),
      columnIdToShow,
      ...visibleColumns.slice(columnVisibleColumnsIndex)
    ]
    
    const actions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: nextSheetViewVisibleColumns }, true))
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: nextSheetViewVisibleColumns }))
    }
    
    const undoActions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: visibleColumns }, true))
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: visibleColumns }))
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    
    actions()
    
  }
}