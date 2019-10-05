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
// Update Sheet Group
//-----------------------------------------------------------------------------
export const updateSheetSort = (sheetId: ISheet['id'], sortId: string, updates: ISheetSortUpdates, skipVisibleRowsUpdate?: boolean): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    dispatch(updateSheetSortReducer(sortId, updates))

    mutation.updateSheetSort(sortId, updates)
    
    if(!skipVisibleRowsUpdate) {
      setTimeout(() => {
        const {
          allSheets,
          allSheetCells,
          allSheetFilters,
          allSheetGroups,
          allSheetRows,
          allSheetSorts,
        } = getState().sheet

        const sheet = allSheets[sheetId]
        const nextSheetVisibleRows = resolveSheetVisibleRows(sheet, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, allSheetSorts)
        const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

        dispatch(clearSheetSelection(sheetId))
        dispatch(updateSheet(sheetId, {
          rowLeaders: nextSheetRowLeaders,
          visibleRows: nextSheetVisibleRows
        }))
        
      }, 10)
    }
	}
}