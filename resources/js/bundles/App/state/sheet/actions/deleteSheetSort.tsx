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
  updateSheet 
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
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const sheetSort = allSheetSorts[sortId]
    const { [sortId]: deletedSort, ...nextAllSheetSorts } = allSheetSorts
    const nextSheetSorts = sheet.sorts.filter(sheetSortId => sheetSortId !== sortId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, sorts: nextSheetSorts}, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, nextAllSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(updateSheet(sheetId, {
        activeSheetViewId: null,
        rowLeaders: nextSheetRowLeaders,
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    if(sheetSort.sheetViewId === null) {
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      mutation.deleteSheetSort(sortId)
    }
	}
}