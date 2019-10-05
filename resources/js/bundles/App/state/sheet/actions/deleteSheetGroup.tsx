//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

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
// Action
//-----------------------------------------------------------------------------
export const deleteSheetGroup = (sheetId: string, groupId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const { [groupId]: deletedGroup, ...nextAllSheetGroups } = allSheetGroups
    const nextSheetGroups = sheet.groups.filter(sheetGroupId => sheetGroupId !== groupId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, groups: nextSheetGroups}, allSheetRows, allSheetCells, allSheetFilters, nextAllSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetGroups(nextAllSheetGroups))
      dispatch(updateSheet(sheetId, {
        groups: nextSheetGroups,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }, true))
    })
    mutation.deleteSheetGroup(groupId)
	}
}