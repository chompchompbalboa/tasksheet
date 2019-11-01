//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheet, ISheetGroupUpdates } from '@app/state/sheet/types'

import { 
  clearSheetSelection, 
  updateSheetView,
  updateSheetGroupReducer 
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders, 
  resolveSheetVisibleRows
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const updateSheetGroup = (sheetId: ISheet['id'], groupId: string, updates: ISheetGroupUpdates, skipVisibleRowsUpdate?: boolean): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    dispatch(updateSheetGroupReducer(groupId, updates))

    mutation.updateSheetGroup(groupId, updates)
    
    if(!skipVisibleRowsUpdate) {
      setTimeout(() => {
        const {
          allSheets,
          allSheetCells,
          allSheetFilters,
          allSheetGroups,
          allSheetRows,
          allSheetSorts,
          allSheetViews
        } = getState().sheet

        const sheet = allSheets[sheetId]
        const activeSheetView = allSheetViews[sheet.activeSheetViewId]

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

        dispatch(clearSheetSelection(sheetId))
        dispatch(updateSheetView(activeSheetView.id, {
          visibleRowLeaders: nextSheetRowLeaders,
          visibleRows: nextSheetVisibleRows
        }))

      }, 10)
    }
	}
}