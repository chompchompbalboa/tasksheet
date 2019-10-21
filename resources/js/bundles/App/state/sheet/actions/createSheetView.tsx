//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { 
  ISheet, 
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort,
  IAllSheetViews, ISheetView, ISheetViewToDatabase
} from '@app/state/sheet/types'

import { 
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  setAllSheetFilters,
  setAllSheetGroups,
  setAllSheetSorts,
  setAllSheetViews,
  updateSheet 
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const createSheetView = (sheetId: ISheet['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          filters: sheetFilters,
          groups: sheetGroups,
          sorts: sheetSorts,
          views: sheetViews
        }
      },
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews
    } = getState().sheet

    if(sheetFilters.length > 0 || sheetGroups.length > 0 || sheetSorts.length > 0) {

      const newSheetViewId = createUuid()
      
      const nextAllSheetFilters: IAllSheetFilters = { ...allSheetFilters }
      const newSheetFilters: IAllSheetFilters = {}
      const nextSheetFilters: ISheetFilter['id'][] = []
      sheetFilters.forEach(sheetFilterId => {
        const sheetFilter = allSheetFilters[sheetFilterId]
        const sheetViewFilterId = createUuid()
        const newSheetFilter: ISheetFilter = {
          ...sheetFilter,
          id: sheetViewFilterId,
          sheetId: null,
          sheetViewId: newSheetViewId
        }
        nextAllSheetFilters[sheetViewFilterId] = newSheetFilter
        newSheetFilters[sheetViewFilterId] = newSheetFilter
        nextSheetFilters.push(sheetViewFilterId)
      })
      
      const nextAllSheetGroups: IAllSheetGroups = { ...allSheetGroups }
      const newSheetGroups: IAllSheetGroups = {}
      const nextSheetGroups: ISheetGroup['id'][] = []
      sheetGroups.forEach(sheetGroupId => {
        const sheetGroup = allSheetGroups[sheetGroupId]
        const sheetViewGroupId = createUuid()
        const newSheetGroup: ISheetGroup = {
          ...sheetGroup,
          id: sheetViewGroupId,
          sheetId: null,
          sheetViewId: newSheetViewId
        }
        nextAllSheetGroups[sheetViewGroupId] = newSheetGroup
        newSheetGroups[sheetViewGroupId] = newSheetGroup
        nextSheetGroups.push(sheetViewGroupId)
      })
      
      const nextAllSheetSorts: IAllSheetSorts = { ...allSheetSorts }
      const newSheetSorts: IAllSheetSorts = {}
      const nextSheetSorts: ISheetSort['id'][] = [ ]
      sheetSorts.forEach(sheetSortId => {
        const sheetSort = allSheetSorts[sheetSortId]
        const sheetViewSortId = createUuid()
        const newSheetSort: ISheetSort = {
          ...sheetSort,
          id: sheetViewSortId,
          sheetId: null,
          sheetViewId: newSheetViewId
        }
        nextAllSheetSorts[sheetViewSortId] = newSheetSort
        newSheetSorts[sheetViewSortId] = newSheetSort
        nextSheetSorts.push(sheetViewSortId)
      })
  
      const newSheetView: ISheetView = {
        id: newSheetViewId,
        sheetId: sheetId,
        name: null,
        filters: nextSheetFilters,
        groups: nextSheetGroups,
        sorts: nextSheetSorts
      }

      const newSheetViewToDataBase: ISheetViewToDatabase = {
        id: newSheetViewId,
        sheetId: sheetId,
        name: null,
        filters: newSheetFilters,
        groups: newSheetGroups,
        sorts: newSheetSorts
      }
  
      const nextAllSheetViews: IAllSheetViews = { [newSheetView.id]: newSheetView, ...allSheetViews }
      const nextSheetViews = [ ...sheetViews, newSheetView.id ]
  
      dispatch(preventSelectedCellEditing(sheetId))
      dispatch(preventSelectedCellNavigation(sheetId))
      dispatch(updateSheet(sheetId, {
        activeSheetViewId: newSheetView.id,
        filters: nextSheetFilters,
        groups: nextSheetGroups,
        sorts: nextSheetSorts,
        views: nextSheetViews
      }))
      dispatch(setAllSheetFilters(nextAllSheetFilters))
      dispatch(setAllSheetGroups(nextAllSheetGroups))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(setAllSheetViews(nextAllSheetViews))
      mutation.createSheetView(newSheetViewToDataBase)
    }
  }
}