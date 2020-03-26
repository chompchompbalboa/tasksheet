//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import clone from '@/utils/clone'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet } from '@/state/sheet/types'

import { createHistoryStep } from '@/state/history/actions'
import { updateSheetView } from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Column Break
//-----------------------------------------------------------------------------
export const createSheetColumnBreak = (sheetId: ISheet['id'], visibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetViews
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const sheetViewVisibleColumns = activeSheetView.visibleColumns.length === 0 ? clone(sheet.columns) : clone(activeSheetView.visibleColumns)

    const isMultipleColumnsSelected = sheet.selections.rangeColumnIds.size > 1 && sheet.selections.rangeColumnIds.has(activeSheetView.visibleColumns[visibleColumnsIndex])
    const insertAtVisibleColumnsIndex = isMultipleColumnsSelected
      ? activeSheetView.visibleColumns.indexOf(sheet.selections.rangeStartColumnId)
      : visibleColumnsIndex

    const nextSheetViewVisibleColumns = [
      ...sheetViewVisibleColumns.slice(0, insertAtVisibleColumnsIndex),
      'COLUMN_BREAK',
      ...sheetViewVisibleColumns.slice(insertAtVisibleColumnsIndex)
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