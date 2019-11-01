//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { 
  clearSheetSelection,
  setAllSheetSorts,
  updateSheetView
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetSort = (sheetId: string, sortId: string): IThunkAction => {
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
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const { [sortId]: deletedSort, ...nextAllSheetSorts } = allSheetSorts
    const nextSheetViewSorts = activeSheetView.sorts.filter(sheetSortId => sheetSortId !== sortId)
    const nextSheetViewVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetRows, 
      allSheetCells,
      allSheetFilters, 
      allSheetGroups, 
      nextAllSheetSorts,
      {
        ...allSheetViews,
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          sorts: nextSheetViewSorts
        }
      }
    )
    const nextSheetViewRowLeaders = resolveSheetRowLeaders(nextSheetViewVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(updateSheetView(activeSheetView.id, {
        visibleRowLeaders: nextSheetViewRowLeaders,
        sorts: nextSheetViewSorts,
        visibleRows: nextSheetViewVisibleRows
      }))
    })
    mutation.deleteSheetSort(sortId)
	}
}