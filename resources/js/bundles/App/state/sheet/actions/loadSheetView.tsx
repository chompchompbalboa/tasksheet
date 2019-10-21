//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, 
  ISheetFilter,
  ISheetGroup,
  ISheetSort,
  ISheetView
} from '@app/state/sheet/types'

import { 
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

    const nextSheetFilters: ISheetFilter['id'][] = [ ...sheetView.filters ]
    const nextSheetGroups: ISheetGroup['id'][] = [ ...sheetView.groups ]
    const nextSheetSorts: ISheetSort['id'][] = [ ...sheetView.sorts ]

    const nextSheetVisibleRows = resolveSheetVisibleRows(
      {
        ...sheet,
        filters: nextSheetFilters,
        groups: nextSheetGroups,
        sorts: nextSheetSorts
      }, 
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts
    )
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
  
    dispatch(updateSheet(sheetId, {
      filters: nextSheetFilters,
      groups: nextSheetGroups,
      rowLeaders: nextSheetRowLeaders,
      sorts: nextSheetSorts,
      visibleRows: nextSheetVisibleRows
    }, true))
  }
}