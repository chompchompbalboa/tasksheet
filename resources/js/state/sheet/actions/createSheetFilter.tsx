//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetFilter } from '@/state/sheet/types'
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
// Create Sheet Filter
//-----------------------------------------------------------------------------
export const createSheetFilter = (sheetId: string, newFilter: ISheetFilter): IThunkAction => {
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
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const nextAllSheetFilters = { ...allSheetFilters, [newFilter.id]: newFilter }
    const nextSheetViewFilters = [ ...activeSheetView.filters, newFilter.id ]
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
        visibleRowLeaders: nextSheetVisibleRowLeaders,
      }, true))
      dispatch(updateSheetView(activeSheetView.id, {
        filters: nextSheetViewFilters
      }, true))
    })

    mutation.createSheetFilter(newFilter)

  }
}