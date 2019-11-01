//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetFilter } from '@app/state/sheet/types'
import { 
  clearSheetSelection,
  setAllSheetFilters,
  updateSheetView
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Filter
//-----------------------------------------------------------------------------
export const createSheetFilter = (sheetId: string, newFilter: ISheetFilter): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const nextFilters = { ...allSheetFilters, [newFilter.id]: newFilter }
    const nextSheetViewFilters = [ ...activeSheetView.filters, newFilter.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetRows, 
      allSheetCells, 
      nextFilters, 
      allSheetGroups, 
      allSheetSorts, 
      { 
        ...allSheetViews, 
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          filters: nextSheetViewFilters,
        }
      }
    )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetFilters({ ...allSheetFilters, [newFilter.id]: newFilter }))
      dispatch(updateSheetView(activeSheetView.id, {
        filters: nextSheetViewFilters,
        visibleRowLeaders: nextSheetVisibleRowLeaders,
        visibleRows: nextSheetVisibleRows
      }))
    })

    mutation.createSheetFilter(newFilter)

  }
}