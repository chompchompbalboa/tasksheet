//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { ISheetGroup } from '@/state/sheet/types'
import { 
  clearSheetSelection,
  setAllSheetGroups,
  updateSheet,
  updateSheetView
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

import { 
  resolveSheetRowLeaders,
  resolveSheetVisibleRows 
} from '@/state/sheet/resolvers'

//-----------------------------------------------------------------------------
// Create Sheet Group
//-----------------------------------------------------------------------------
export const createSheetGroup = (sheetId: string, newGroup: ISheetGroup): IThunkAction => {
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

    const nextAllSheetGroups = { ...allSheetGroups, [newGroup.id]: newGroup }
    const nextSheetViewGroups = [ ...activeSheetView.groups, newGroup.id ]
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

    const actions = (isHistoryStep: boolean = false) => {
      batch(() => {
        dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetGroups(nextAllSheetGroups))
        dispatch(updateSheet(sheetId, {
          visibleRows: nextSheetVisibleRows,
          visibleRowLeaders: nextSheetVisibleRowLeaders,
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          groups: nextSheetViewGroups
        }, true))
      })
      if(!isHistoryStep) {
        mutation.createSheetGroup(newGroup)
      }
      else {
        mutation.restoreSheetGroup(newGroup.id)
      }
    }

    const undoActions = () => {
      batch(() => {
        dispatch(clearSheetSelection(sheetId))
        dispatch(setAllSheetGroups(allSheetGroups))
        dispatch(updateSheet(sheetId, {
          visibleRows: sheet.visibleRows,
          visibleRowLeaders: sheet.visibleRowLeaders,
        }, true))
        dispatch(updateSheetView(activeSheetView.id, {
          groups: activeSheetView.groups
        }, true))
      })
      mutation.deleteSheetGroup(newGroup.id)
    }

    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
  }
}