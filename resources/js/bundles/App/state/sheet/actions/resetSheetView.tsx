//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet
} from '@app/state/sheet/types'

import { 
  updateSheet 
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
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts
    } = getState().sheet

    const nextSheetVisibleRows = resolveSheetVisibleRows(
      {
        ...sheet,
        filters: [],
        groups: [],
        sorts: []
      }, 
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts
    )
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
  
    dispatch(updateSheet(sheetId, {
      activeSheetViewId: null,
      filters: [],
      groups: [],
      rowLeaders: nextSheetRowLeaders,
      sorts: [],
      visibleRows: nextSheetVisibleRows
    }))
    mutation.resetSheetView(sheetId)
  }
}