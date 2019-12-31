//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { ISheet, ISheetColumn } from '@/state/sheet/types'

import { updateSheetView } from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

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
    const visibleColumns = activeSheetView.visibleColumns
    
    const nextSheetViewVisibleColumns = [
      ...visibleColumns.slice(0, columnVisibleColumnsIndex),
      columnIdToShow,
      ...visibleColumns.slice(columnVisibleColumnsIndex)
    ]
    
    const actions = () => {
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: nextSheetViewVisibleColumns }))
    }
    
    const undoActions = () => {
      dispatch(updateSheetView(activeSheetView.id, { visibleColumns: visibleColumns }))
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    
    actions()
    
  }
}