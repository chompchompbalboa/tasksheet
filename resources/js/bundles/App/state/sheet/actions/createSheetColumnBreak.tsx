//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import clone from '@/utils/clone'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet } from '@app/state/sheet/types'

import { createHistoryStep } from '@app/state/history/actions'
import { updateSheetView } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Column Break
//-----------------------------------------------------------------------------
export const createSheetColumnBreak = (sheetId: ISheet['id'], newColumnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetViews
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const sheetViewVisibleColumns = activeSheetView.visibleColumns.length === 0 ? clone(sheet.columns) : clone(activeSheetView.visibleColumns)

    const nextSheetViewVisibleColumns = [
      ...sheetViewVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      'COLUMN_BREAK',
      ...sheetViewVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]

    const actions = () => {
      const sheetViewUpdates = { visibleColumns: nextSheetViewVisibleColumns }
      batch(() => {
        dispatch(updateSheetView(activeSheetView.id, sheetViewUpdates))
      })
      mutation.updateSheetView(activeSheetView.id, sheetViewUpdates)
    }

    const undoActions = () => {
      const sheetViewUpdates = { visibleColumns: sheetViewVisibleColumns }
      batch(() => {
        dispatch(updateSheetView(activeSheetView.id, sheetViewUpdates))
      })
      mutation.updateSheetView(activeSheetView.id, sheetViewUpdates)
    }

    dispatch(createHistoryStep({actions, undoActions}))

    actions()
  }
}