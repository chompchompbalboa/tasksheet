//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { updateSheet } from '@app/state/sheet/actions'
import { createHistoryStep } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Column Break
//-----------------------------------------------------------------------------
export const deleteSheetColumnBreak = (sheetId: string, columnBreakIndex: number): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    const {
      allSheets
    } = getState().sheet
    const sheet = allSheets[sheetId]
    
    const nextSheetVisibleColumns = sheet.visibleColumns.filter((_, index) => index !== columnBreakIndex)
    
    const actions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          visibleColumns: nextSheetVisibleColumns
        }))
      })
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(updateSheet(sheetId, {
          visibleColumns: sheet.visibleColumns
        }))
      })
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}