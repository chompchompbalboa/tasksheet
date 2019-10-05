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
  updateSheet
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
      allSheetSorts
    } = getState().sheet
    const sheet = allSheets[sheetId]

    const nextFilters = { ...allSheetFilters, [newFilter.id]: newFilter }
    const nextSheetFilters = [ ...sheet.filters, newFilter.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows({ 
      ...sheet, 
      filters: nextSheetFilters 
    }, allSheetRows, allSheetCells, nextFilters, allSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetFilters({ ...allSheetFilters, [newFilter.id]: newFilter }))
      dispatch(updateSheet(sheetId, {
        filters: nextSheetFilters,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }, true))
    })

    mutation.createSheetFilter(newFilter)

  }
}