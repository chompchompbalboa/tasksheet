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
export const deleteSheetGroup = (sheetId: string, groupId: string): IThunkAction => {
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
    const { [groupId]: deletedGroup, ...nextAllSheetGroups } = allSheetGroups
    const nextSheetGroups = sheet.groups.filter(sheetGroupId => sheetGroupId !== groupId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, groups: nextSheetGroups}, allSheetRows, allSheetCells, allSheetFilters, nextAllSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    if(sheet.activeSheetViewId) {
      const activeSheetView = allSheetViews[sheet.activeSheetViewId]
      dispatch(updateSheetView(activeSheetView.id, {
        groups: activeSheetView.groups.filter(activeSheetViewGroupId => activeSheetViewGroupId !== groupId)
      }))
    }
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetGroups(nextAllSheetGroups))
      dispatch(updateSheet(sheetId, {
        groups: nextSheetGroups,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetGroup(groupId)
	}
}