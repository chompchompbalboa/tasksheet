//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { 
  clearSheetSelection,
  setAllSheetViews,
  setAllSheetCells,
  updateSheet 
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

import { 
  resolveSheetVisibleRows,
  resolveSheetRowLeaders
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetView = (sheetId: string, sheetViewId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetViews,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetPriorities
    } = getState().sheet

    const sheet = allSheets[sheetId]

    const { [sheetViewId]: deletedView, ...nextAllSheetViews } = allSheetViews
    const nextSheetViews = sheet.views.filter(currentSheetViewId => currentSheetViewId !== sheetViewId)
    
    const nextActiveSheetViewId = sheet.activeSheetViewId === sheetViewId 
      ? nextSheetViews[Math.min(nextSheetViews.length - 1, sheet.views.indexOf(sheetViewId))] 
      : sheet.activeSheetViewId

    let nextSheetVisibleRows = sheet.visibleRows
    let nextSheetVisibleRowLeaders = sheet.visibleRowLeaders
    if(nextActiveSheetViewId !== sheet.activeSheetViewId) {
      nextSheetVisibleRows = resolveSheetVisibleRows(
        {
          ...sheet,
          activeSheetViewId: nextActiveSheetViewId
        },
        allSheetColumns,
        allSheetRows,
        allSheetCells,
        allSheetFilters,
        allSheetGroups,
        allSheetSorts,
        allSheetViews,
        allSheetPriorities
      )
      nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    }

    const actions = () => {
      batch(() => {
        if(nextActiveSheetViewId !== sheet.activeSheetViewId) {
          dispatch(clearSheetSelection(sheetId))
        }
        dispatch(setAllSheetViews(nextAllSheetViews))
        dispatch(updateSheet(sheetId, {
          activeSheetViewId: nextActiveSheetViewId,
          views: nextSheetViews,
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetVisibleRowLeaders
        }))
      })
      mutation.deleteSheetView(sheetViewId)
    }

    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheetViews(allSheetViews))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(updateSheet(sheetId, {
          activeSheetViewId: sheet.activeSheetViewId,
          selections: sheet.selections,
          views: sheet.views,
          visibleRows: sheet.visibleRows,
          visibleRowLeaders: sheet.visibleRowLeaders
        }))
      })
      mutation.restoreSheetView(sheetViewId)
    }

    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}