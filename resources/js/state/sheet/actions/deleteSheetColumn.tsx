//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import clone from '@/utils/clone'
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  IAllSheets,
  IAllSheetCells,
  ISheetFilter, IAllSheetFilters,
  ISheetGroup, IAllSheetGroups,
  ISheetSort, IAllSheetSorts,
  IAllSheetRows
} from '@/state/sheet/types'

import { 
  clearSheetSelection,
  setAllSheets,
  setAllSheetColumns,
  setAllSheetRows,
  setAllSheetCells,
  setAllSheetViews,
  setAllSheetFilters,
  setAllSheetGroups,
  setAllSheetSorts,
} from '@/state/sheet/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Delete Sheet Column
//-----------------------------------------------------------------------------
export const deleteSheetColumn = (sheetId: string, columnId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    dispatch(clearSheetSelection(sheetId))

    const {
      allSheets,
      allSheetCells,
      allSheetColumns,
      allSheetRows,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts,
      allSheetViews
    } = getState().sheet
    
    // All Columns
    const { [columnId]: deletedColumn, ...nextAllSheetColumns } = allSheetColumns
    
    // Sheet Columns
    const nextAllSheets: IAllSheets = {}
    Object.keys(allSheets).forEach(sheetId => {
      const sheet = allSheets[sheetId]
      nextAllSheets[sheetId] = {
        ...sheet,
        columns: sheet.columns.filter(sheetColumnId => sheetColumnId !== columnId)
      }
    })
    
    // All Rows
    const nextAllSheetRows: IAllSheetRows = {}
    Object.keys(allSheetRows).forEach(rowId => {
      const { [columnId]: deletedCell, ...nextSheetRowCells } = allSheetRows[rowId].cells
      nextAllSheetRows[rowId] = {
        ...allSheetRows[rowId],
        cells: nextSheetRowCells
      }
    })
    
    // All Cells
    const nextAllSheetCells: IAllSheetCells = {}
    Object.keys(allSheetCells).forEach(cellId => {
      const cell = allSheetCells[cellId]
      if(cell.columnId !== columnId) { nextAllSheetCells[cellId] = cell }
    })

    // All Filters
    const deletedSheetFilterIds: ISheetFilter['id'][] = []
    const nextAllSheetFilters: IAllSheetFilters = {}
    Object.keys(allSheetFilters).forEach(filterId => {
      const filter = allSheetFilters[filterId]
      if(filter.columnId !== columnId) { nextAllSheetFilters[filterId] = filter }
      else { deletedSheetFilterIds.push(filter.id) }
    })

    // All Groups
    const deletedSheetGroupIds: ISheetGroup['id'][] = []
    const nextAllSheetGroups: IAllSheetGroups = {}
    Object.keys(allSheetGroups).forEach(groupId => {
      const group = allSheetGroups[groupId]
      if(group.columnId !== columnId) { nextAllSheetGroups[groupId] = group }
      else { deletedSheetGroupIds.push(group.id) }
    })

    // All Sorts
    const deletedSheetSortIds: ISheetSort['id'][] = []
    const nextAllSheetSorts: IAllSheetSorts = {}
    Object.keys(allSheetSorts).forEach(sortId => {
      const sort = allSheetSorts[sortId]
      if(sort.columnId !== columnId) { nextAllSheetSorts[sortId] = sort }
      else { deletedSheetSortIds.push(sort.id) }
    })

    // Sheet Views
    const nextAllSheetViews = clone(allSheetViews)
    Object.keys(allSheetViews).forEach(sheetViewId => {
      const sheetView = allSheetViews[sheetViewId]
      nextAllSheetViews[sheetViewId] = {
        ...sheetView,
        visibleColumns: sheetView.visibleColumns.filter(visibleColumnId => visibleColumnId !== columnId),
        filters: sheetView.filters.filter(filterId => !deletedSheetFilterIds.includes(filterId)),
        groups: sheetView.groups.filter(groupId => !deletedSheetGroupIds.includes(groupId)),
        sorts: sheetView.sorts.filter(sortId => !deletedSheetSortIds.includes(sortId)),
      }
    })

    const actions = () => {
      batch(() => {
        dispatch(setAllSheets(nextAllSheets))
        dispatch(setAllSheetColumns(nextAllSheetColumns))
        dispatch(setAllSheetRows(nextAllSheetRows))
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetViews(nextAllSheetViews))
        dispatch(setAllSheetFilters(nextAllSheetFilters))
        dispatch(setAllSheetGroups(nextAllSheetGroups))
        dispatch(setAllSheetSorts(nextAllSheetSorts))
      })
      mutation.deleteSheetColumns([ columnId ])
    }
    
    const undoActions = () => {
      batch(() => {
        dispatch(setAllSheets(allSheets))
        dispatch(setAllSheetColumns(allSheetColumns))
        dispatch(setAllSheetRows(allSheetRows))
        dispatch(setAllSheetCells(allSheetCells))
        dispatch(setAllSheetViews(allSheetViews))
        dispatch(setAllSheetFilters(allSheetFilters))
        dispatch(setAllSheetGroups(allSheetGroups))
        dispatch(setAllSheetSorts(allSheetSorts))
      })
      mutation.restoreSheetColumns([ columnId ])
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}