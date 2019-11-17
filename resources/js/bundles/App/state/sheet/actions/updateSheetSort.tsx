//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetSortUpdates } from '@app/state/sheet/types'

import { 
  clearSheetSelection, 
  updateSheet,
  updateSheetSortReducer 
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders, 
  resolveSheetVisibleRows
} from '@app/state/sheet/resolvers'

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
          allSheetCells,
          allSheetFilters,
          allSheetGroups,
          allSheetRows,
          allSheetSorts,
          allSheetViews,
          allSheetPriorities
        } = getState().sheet

        const sheet = allSheets[sheetId]
        const nextSheetVisibleRows = resolveSheetVisibleRows(
          sheet, 
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