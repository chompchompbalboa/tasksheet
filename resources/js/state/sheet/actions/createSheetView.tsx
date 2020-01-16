//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import moment from 'moment'
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  ISheet, 
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort,
  IAllSheetViews, ISheetView, ISheetViewToDatabase
} from '@/state/sheet/types'

import { 
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  setAllSheetFilters,
  setAllSheetGroups,
  setAllSheetSorts,
  setAllSheetViews,
  updateSheet 
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const createSheetView = (sheetId: ISheet['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          activeSheetViewId: sheetActiveSheetViewId,
          views: sheetViews
        }
      },
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews
    } = getState().sheet

    const activeSheetView = allSheetViews[sheetActiveSheetViewId]

    const startTime = moment()
    let startTimeModifier = 0
    
    const newSheetViewId = createUuid()

    const nextAllSheetFilters: IAllSheetFilters = { ...allSheetFilters }
    const newSheetFilters: IAllSheetFilters = {}
    const nextSheetFilters: ISheetFilter['id'][] = []
    activeSheetView.filters.forEach(sheetFilterId => {
      const sheetFilter = allSheetFilters[sheetFilterId]
      const sheetViewFilterId = createUuid()
      const newSheetFilter: ISheetFilter = {
        ...sheetFilter,
        id: sheetViewFilterId,
        createdAt: moment(startTime).add(startTimeModifier, 'second').format('YYYY-MM-DD HH:mm:ss'),
        sheetId: null,
        sheetViewId: newSheetViewId
      }
      nextAllSheetFilters[sheetViewFilterId] = newSheetFilter
      newSheetFilters[sheetViewFilterId] = newSheetFilter
      nextSheetFilters.push(sheetViewFilterId)
      startTimeModifier++
    })

    const nextAllSheetGroups: IAllSheetGroups = { ...allSheetGroups }
    const newSheetGroups: IAllSheetGroups = {}
    const nextSheetGroups: ISheetGroup['id'][] = []
    activeSheetView.groups.forEach(sheetGroupId => {
      const sheetGroup = allSheetGroups[sheetGroupId]
      const sheetViewGroupId = createUuid()
      const newSheetGroup: ISheetGroup = {
        ...sheetGroup,
        id: sheetViewGroupId,
        createdAt: moment(startTime).add(startTimeModifier, 'second').format('YYYY-MM-DD HH:mm:ss'),
        sheetId: null,
        sheetViewId: newSheetViewId
      }
      nextAllSheetGroups[sheetViewGroupId] = newSheetGroup
      newSheetGroups[sheetViewGroupId] = newSheetGroup
      nextSheetGroups.push(sheetViewGroupId)
      startTimeModifier++
    })

    const nextAllSheetSorts: IAllSheetSorts = { ...allSheetSorts }
    const newSheetSorts: IAllSheetSorts = {}
    const nextSheetSorts: ISheetSort['id'][] = [ ]
    activeSheetView.sorts.forEach(sheetSortId => {
      const sheetSort = allSheetSorts[sheetSortId]
      const sheetViewSortId = createUuid()
      const newSheetSort: ISheetSort = {
        ...sheetSort,
        id: sheetViewSortId,
        createdAt: moment(startTime).add(startTimeModifier, 'second').format('YYYY-MM-DD HH:mm:ss'),
        sheetId: null,
        sheetViewId: newSheetViewId
      }
      nextAllSheetSorts[sheetViewSortId] = newSheetSort
      newSheetSorts[sheetViewSortId] = newSheetSort
      nextSheetSorts.push(sheetViewSortId)
      startTimeModifier++
    })

    const newSheetView: ISheetView = {
      id: newSheetViewId,
      sheetId: sheetId,
      name: null,
      isLocked: false,
      visibleColumns: activeSheetView.visibleColumns,
      filters: nextSheetFilters,
      groups: nextSheetGroups,
      sorts: nextSheetSorts,
      searchValue: null
    }

    const newSheetViewToDataBase: ISheetViewToDatabase = {
      id: newSheetViewId,
      sheetId: sheetId,
      name: null,
      isLocked: false,
      visibleColumns: activeSheetView.visibleColumns,
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
      views: nextSheetViews
    }, true))
    dispatch(setAllSheetFilters(nextAllSheetFilters))
    dispatch(setAllSheetGroups(nextAllSheetGroups))
    dispatch(setAllSheetSorts(nextAllSheetSorts))
    dispatch(setAllSheetViews(nextAllSheetViews))
    mutation.createSheetView(newSheetViewToDataBase)
  }
}