//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { 
  clearSheetSelection,
  setAllSheetFilters,
  updateSheet,
  updateSheetView
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetFilter = (sheetId: string, filterId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

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

    const { [filterId]: deletedFilter, ...nextAllSheetFilters } = allSheetFilters

    const nextSheetFilters = sheet.filters.filter(sheetFilterId => sheetFilterId !== filterId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, filters: nextSheetFilters}, allSheetRows, allSheetCells, nextAllSheetFilters, allSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    if(sheet.activeSheetViewId) {
      const activeSheetView = allSheetViews[sheet.activeSheetViewId]
      dispatch(updateSheetView(activeSheetView.id, {
        filters: activeSheetView.filters.filter(activeSheetViewFilterId => activeSheetViewFilterId !== filterId)
      }))
    }

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetFilters(nextAllSheetFilters))
      dispatch(updateSheet(sheetId, {
        filters: nextSheetFilters,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetFilter(filterId)
	}
}