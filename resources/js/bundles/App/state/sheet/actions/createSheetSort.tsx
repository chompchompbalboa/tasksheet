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
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
      allSheetViews
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const nextAllSheetSorts = { ...allSheetSorts, [newSort.id]: newSort }
    const nextSheetSorts = [ ...sheet.sorts, newSort.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, sorts: nextSheetSorts }, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, nextAllSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    if(sheet.activeSheetViewId) {
      const activeSheetView = allSheetViews[sheet.activeSheetViewId]
      dispatch(updateSheetView(activeSheetView.id, {
        sorts: [ ...activeSheetView.sorts, newSort.id ]
      }))
    }
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(updateSheet(sheetId, {
        rowLeaders: nextSheetRowLeaders,
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }, true))
    })
    mutation.createSheetSort(newSort)
	}
}