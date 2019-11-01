//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheet, ISheetColumn } from '@app/state/sheet/types'

import { updateSheet } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Show Sheet Column
//-----------------------------------------------------------------------------
export const showSheetColumn = (sheetId: ISheet['id'], columnVisibleColumnsIndex: number, columnIdToShow: ISheetColumn['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      visibleColumns
    } = getState().sheet.allSheets[sheetId]
    const nextVisibleColumns = [
      ...visibleColumns.slice(0, columnVisibleColumnsIndex),
      columnIdToShow,
      ...visibleColumns.slice(columnVisibleColumnsIndex)
    ]
    const actions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: nextVisibleColumns }))
    }
    const undoActions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: visibleColumns }))
    }
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
    
  }
}