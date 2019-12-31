//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheet, ISheetSortUpdates } from '@/state/sheet/types'

import { 
  clearSheetSelection, 
  updateSheet,
  updateSheetSortReducer 
} from '@/state/sheet/actions'

import { 
  resolveSheetRowLeaders, 
  resolveSheetVisibleRows
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Update Sheet Sort
//-----------------------------------------------------------------------------
export const updateSheetSort = (sheetId: ISheet['id'], groupId: string, updates: ISheetSortUpdates, skipVisibleRowsUpdate?: boolean): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    dispatch(updateSheetSortReducer(groupId, updates))

    mutation.updateSheetSort(groupId, updates)
    
    if(!skipVisibleRowsUpdate) {
      setTimeout(() => {
        const {
          allSheets,
          allSheetColumns,
          allSheetRows,
          allSheetCells,
          allSheetFilters,
          allSheetGroups,
          allSheetSorts,
          allSheetViews,
          allSheetPriorities
        } = getState().sheet

        const sheet = allSheets[sheetId]
        const nextSheetVisibleRows = resolveSheetVisibleRows(
          sheet, 
          allSheetColumns,
          allSheetRows, 
          allSheetCells, 
          allSheetFilters, 
          allSheetGroups, 
          allSheetSorts,
          allSheetViews,
          allSheetPriorities
        )
        const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

        dispatch(clearSheetSelection(sheetId))
        dispatch(updateSheet(sheetId, {
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetRowLeaders
        }))

      }, 10)
    }
	}
}