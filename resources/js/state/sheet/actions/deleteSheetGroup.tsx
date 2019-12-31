//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'

import { 
  clearSheetSelection,
  setAllSheetGroups,
  updateSheet,
  updateSheetView
} from '@/state/sheet/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const deleteSheetGroup = (sheetId: string, groupId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allSheets,
      allSheetColumns,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
      allSheetViews,
      allSheetPriorities
    } = getState().sheet

    const sheet = allSheets[sheetId]
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]

    const { [groupId]: deletedGroup, ...nextAllSheetGroups } = allSheetGroups

    const nextSheetViewGroups = activeSheetView.groups.filter(sheetGroupId => sheetGroupId !== groupId)
    const nextSheetVisibleRows = resolveSheetVisibleRows(
      sheet, 
      allSheetColumns,
      allSheetRows, 
      allSheetCells, 
      allSheetFilters, 
      nextAllSheetGroups, 
      allSheetSorts,
      {
        ...allSheetViews,
        [activeSheetView.id]: {
          ...allSheetViews[activeSheetView.id],
          groups: nextSheetViewGroups
        }
      },
      allSheetPriorities
      )
    const nextSheetVisibleRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)

    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetGroups(nextAllSheetGroups))
      dispatch(updateSheet(sheetId, {
        visibleRows: nextSheetVisibleRows,
        visibleRowLeaders: nextSheetVisibleRowLeaders
      }))
      dispatch(updateSheetView(activeSheetView.id, {
        groups: nextSheetViewGroups
      }))
    })
    mutation.deleteSheetGroup(groupId)
	}
}