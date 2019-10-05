//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { ISheet } from '@app/state/sheet/types'

import { updateSheet } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Hide Sheet Column
//-----------------------------------------------------------------------------
export const hideSheetColumn = (sheetId: ISheet['id'], columnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      visibleColumns
    } = getState().sheet.allSheets[sheetId]

    const nextSheetVisibleColumns = visibleColumns.filter((_, index) => index !== columnVisibleColumnsIndex)

    const actions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: nextSheetVisibleColumns }))
    }

    const undoActions = () => {
      dispatch(updateSheet(sheetId, { visibleColumns: visibleColumns }))
    }

    dispatch(createHistoryStep({ actions, undoActions }))

    actions()
  }
}