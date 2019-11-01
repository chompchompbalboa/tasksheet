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
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews
    } = getState().sheet

    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const nextSheetViewVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      allSheetGroups, 
      allSheetSorts,
      {
        ...allSheetViews,
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          filters: [],
          groups: [],
          sorts: []
        }
      }
    )
    const nextSheetViewRowLeaders = resolveSheetRowLeaders(nextSheetViewVisibleRows)
  
    dispatch(updateSheetView(activeSheetView.id, {
      filters: [],
      groups: [],
      visibleRowLeaders: nextSheetViewRowLeaders,
      sorts: [],
      visibleRows: nextSheetViewVisibleRows
    }))
    mutation.resetSheetView(sheetId)
  }
}