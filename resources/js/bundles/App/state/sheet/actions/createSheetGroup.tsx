//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { ISheetGroup } from '@app/state/sheet/types'
import { 
  clearSheetSelection,
  setAllSheetGroups,
  updateSheet
} from '@app/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@app/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Group
//-----------------------------------------------------------------------------
export const createSheetGroup = (sheetId: string, newGroup: ISheetGroup): IThunkAction => {
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
    const nextAllSheetGroups = { ...allSheetGroups, [newGroup.id]: newGroup }
    const nextSheetGroups = [ ...sheet.groups, newGroup.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, groups: nextSheetGroups }, allSheetRows, allSheetCells, allSheetFilters, nextAllSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetGroups({ ...allSheetGroups, [newGroup.id]: newGroup }))
      dispatch(updateSheet(sheetId, {
        groups: nextSheetGroups,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }, true))
    })
    mutation.createSheetGroup(newGroup)
	}
}