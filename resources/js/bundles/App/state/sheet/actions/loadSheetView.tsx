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
  updateSheet 
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

    const sheetView = allSheetViews[sheetViewId]

    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts,
      allSheetViews
    )
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
  
    dispatch(updateSheet(sheetId, {
      activeSheetViewId: sheetView.id,
      visibleRows: nextSheetVisibleRows,
      visibleRowLeaders: nextSheetRowLeaders,
    }))
  }
}