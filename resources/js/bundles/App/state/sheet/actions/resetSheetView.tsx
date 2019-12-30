//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, ISheetView
} from '@app/state/sheet/types'

import { 
  updateSheet,
  updateSheetView
} from '@app/state/sheet/actions'

import {
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Reset Sheet View
//-----------------------------------------------------------------------------
export const resetSheetView = (sheetId: ISheet['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: { [sheetId]: sheet },
      allSheetColumns,
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet

    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    
    const nextActiveSheetView: ISheetView = {
      ...activeSheetView,
      filters: [],
      groups: [],
      sorts: []
    }

    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetColumns,
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts,
      {
        ...allSheetViews,
        [nextActiveSheetView.id]: nextActiveSheetView
      },
      allSheetPriorities
    )
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
  
    dispatch(updateSheet(sheetId, {
      visibleRows: nextSheetVisibleRows,
      visibleRowLeaders: nextSheetRowLeaders,
    }, true))
    dispatch(updateSheetView(activeSheetView.id, {
      filters: [],
      groups: [],
      sorts: []
    }, true))
    mutation.resetSheetView(activeSheetView.id)
  }
}