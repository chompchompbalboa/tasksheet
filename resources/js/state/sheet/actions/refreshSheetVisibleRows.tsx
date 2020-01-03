//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  clearSheetSelection,
  updateSheet
} from '@/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Refresh Sheet Visible Rows
//-----------------------------------------------------------------------------
export const refreshSheetVisibleRows = (sheetId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
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
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(updateSheet(sheetId, {
        visibleRows: nextSheetVisibleRows,
        visibleRowLeaders: nextSheetVisibleRowLeaders,
      }, true))
    })
	}
}