//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { 
  clearSheetSelection,
  setAllSheetFilters,
  updateSheet,
  updateSheetView
} from '@/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetFilter = (sheetId: string, filterId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetColumns,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const { [filterId]: deletedFilter, ...nextAllSheetFilters } = allSheetFilters

    const nextSheetViewFilters = activeSheetView.filters.filter(sheetFilterId => sheetFilterId !== filterId)
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetColumns,
      allSheetRows, 
      allSheetCells, 
      nextAllSheetFilters, 
      allSheetGroups, 
      allSheetSorts,
      {
        ...allSheetViews,
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          filters: nextSheetViewFilters
        }
      },
      allSheetPriorities
      )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetFilters(nextAllSheetFilters))
      dispatch(updateSheet(sheetId, {
        visibleRows: nextSheetVisibleRows,
        visibleRowLeaders: nextSheetVisibleRowLeaders
      }))
      dispatch(updateSheetView(activeSheetView.id, {
        filters: nextSheetViewFilters
      }))
    })
    mutation.deleteSheetFilter(filterId)
	}
}