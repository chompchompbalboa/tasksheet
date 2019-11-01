//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, 
  ISheetView
} from '@app/state/sheet/types'

import { 
  clearSheetSelection,
  updateSheet,
  updateSheetView
} from '@app/state/sheet/actions'

import {
  resolveSheetRowLeaders,
  resolveSheetVisibleRows
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const loadSheetView = (sheetId: ISheet['id'], sheetViewId: ISheetView['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    
    dispatch(clearSheetSelection(sheetId))
    
    const {
      allSheets: { [sheetId]: sheet },
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews
    } = getState().sheet

    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const nextActiveSheetView = allSheetViews[sheetViewId]

    const nextSheetViewVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts,
      allSheetViews
    )
    const nextSheetViewRowLeaders = resolveSheetRowLeaders(nextSheetViewVisibleRows)
  
    dispatch(updateSheet(sheetId, {
      activeSheetViewId: nextActiveSheetView.id,
    }))
    dispatch(updateSheetView(activeSheetView.id, {
      visibleRows: null,
      visibleRowLeaders: null,
    }))
    dispatch(updateSheetView(nextActiveSheetView.id, {
      visibleRows: nextSheetViewVisibleRows,
      visibleRowLeaders: nextSheetViewRowLeaders,
    }))
  }
}