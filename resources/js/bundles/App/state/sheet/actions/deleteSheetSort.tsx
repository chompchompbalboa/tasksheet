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
    const { [sortId]: deletedSort, ...nextAllSheetSorts } = allSheetSorts
    const nextSheetSorts = sheet.sorts.filter(sheetSortId => sheetSortId !== sortId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, sorts: nextSheetSorts}, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, nextAllSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    if(sheet.activeSheetViewId) {
      const activeSheetView = allSheetViews[sheet.activeSheetViewId]
      dispatch(updateSheetView(activeSheetView.id, {
        sorts: activeSheetView.sorts.filter(activeSheetViewSortId => activeSheetViewSortId !== sortId)
      }))
    }
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(updateSheet(sheetId, {
        rowLeaders: nextSheetRowLeaders,
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetSort(sortId)
	}
}