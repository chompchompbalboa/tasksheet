//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetSort } from '@app/state/sheet/types'
import { 
  clearSheetSelection,
  setAllSheetSorts,
  updateSheet,
  updateSheetView
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Sort
//-----------------------------------------------------------------------------
export const createSheetSort = (sheetId: string, newSort: ISheetSort): IThunkAction => {
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

    const nextAllSheetSorts = { ...allSheetSorts, [newSort.id]: newSort }
    const nextSheetViewSorts = [ ...activeSheetView.sorts, newSort.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetColumns,
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
      },
      allSheetPriorities
    )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(updateSheet(sheetId, {
        visibleRows: nextSheetVisibleRows,
        visibleRowLeaders: nextSheetVisibleRowLeaders,
      }, true))
      dispatch(updateSheetView(activeSheetView.id, {
        sorts: nextSheetViewSorts
      }))
    })

    mutation.createSheetSort(newSort)

  }
}