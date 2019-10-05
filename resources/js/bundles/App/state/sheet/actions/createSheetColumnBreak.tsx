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
import { updateSheet } from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet Column Break
//-----------------------------------------------------------------------------
export const createSheetColumnBreak = (sheetId: ISheet['id'], newColumnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
    } = getState().sheet
    
    const sheet = allSheets[sheetId]
    const sheetVisibleColumns = sheet.visibleColumns.length === 0 ? clone(sheet.columns) : clone(sheet.visibleColumns)

    const nextSheetVisibleColumns = [
      ...sheetVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      'COLUMN_BREAK',
      ...sheetVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]

    const actions = () => {
      const sheetUpdates = { visibleColumns: nextSheetVisibleColumns }
      batch(() => {
        dispatch(updateSheet(sheetId, sheetUpdates))
      })
      mutation.updateSheet(sheetId, sheetUpdates)
    }

    const undoActions = () => {
      const sheetUpdates = { visibleColumns: sheetVisibleColumns }
      batch(() => {
        dispatch(updateSheet(sheetId, sheetUpdates))
      })
      mutation.updateSheet(sheetId, sheetUpdates)
    }

    dispatch(createHistoryStep({actions, undoActions}))

    actions()
  }
}