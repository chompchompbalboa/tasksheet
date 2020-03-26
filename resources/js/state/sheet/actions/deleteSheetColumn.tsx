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
  IAllSheetColumns, ISheetColumn,
  ISheetRow,
  IAllSheetCells,
  ISheetFilter, IAllSheetFilters,
  ISheetGroup, IAllSheetGroups,
  ISheetSort, IAllSheetSorts,
  IAllSheetRows
} from '@/state/sheet/types'

import { 
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

    // Get the sheet
    const sheet = allSheets[sheetId]

    // Get the ids for the columns that will be deleted
    const isMultipleColumnsSelected = sheet.selections.rangeColumnIds.size > 1 && sheet.selections.rangeColumnIds.has(columnId)
    const columnIdsToDelete: Set<ISheetColumn['id']> = isMultipleColumnsSelected
      ? new Set([ ...sheet.selections.rangeColumnIds ])
      : new Set([ columnId ])

    // All Sheet Columns
    const nextAllSheetColumns: IAllSheetColumns = {}
    Object.keys(allSheetColumns).forEach(sheetColumnId => {
      if(!columnIdsToDelete.has(sheetColumnId)) {
        nextAllSheetColumns[sheetColumnId] = allSheetColumns[sheetColumnId]
      }
    })
    
    // All Sheets
    const nextAllSheets: IAllSheets = {}
    Object.keys(allSheets).forEach(sheetId => {
      nextAllSheets[sheetId] = {
        ...sheet,
        columns: sheet.columns.filter(sheetColumnId => !columnIdsToDelete.has(sheetColumnId))
      }
    })
    
    // All Sheet Rows
    const nextAllSheetRows: IAllSheetRows = {}
    Object.keys(allSheetRows).forEach(rowId => {
      const sheetRow = allSheetRows[rowId]
      const nextSheetRowCells: ISheetRow['cells'] = {}
      Object.keys(sheetRow.cells).forEach(sheetColumnId => {
        if(!columnIdsToDelete.has(sheetColumnId)) {
          nextSheetRowCells[sheetColumnId] = sheetRow.cells[sheetColumnId]
        }
      })
      nextAllSheetRows[rowId] = {
        ...allSheetRows[rowId],
        cells: nextSheetRowCells
      }
    })
    
    // All Sheet Cells
    const nextAllSheetCells: IAllSheetCells = {}
    Object.keys(allSheetCells).forEach(cellId => {
      const cell = allSheetCells[cellId]
      if(!columnIdsToDelete.has(cell.columnId)) { 
        nextAllSheetCells[cellId] = cell 
      }
    })

    // All Sheet Filters
    const deletedSheetFilterIds: ISheetFilter['id'][] = []
    const nextAllSheetFilters: IAllSheetFilters = {}
    allSheetFilters && Object.keys(allSheetFilters).forEach(filterId => {
      const filter = allSheetFilters[filterId]
      if(!columnIdsToDelete.has(filter.columnId)) { 
        nextAllSheetFilters[filterId] = filter 
      }
      else { 
        deletedSheetFilterIds.push(filter.id) 
      }
    })

    // All Sheet Groups
    const deletedSheetGroupIds: ISheetGroup['id'][] = []
    const nextAllSheetGroups: IAllSheetGroups = {}
    allSheetGroups && Object.keys(allSheetGroups).forEach(groupId => {
      const group = allSheetGroups[groupId]
      if(!columnIdsToDelete.has(group.columnId)) { 
        nextAllSheetGroups[groupId] = group 
      }
      else { 
        deletedSheetGroupIds.push(group.id) 
      }
    })

    // All Sheet Sorts
    const deletedSheetSortIds: ISheetSort['id'][] = []
    const nextAllSheetSorts: IAllSheetSorts = {}
    allSheetSorts && Object.keys(allSheetSorts).forEach(sortId => {
      const sort = allSheetSorts[sortId]
      if(!columnIdsToDelete.has(sort.columnId)) { 
        nextAllSheetSorts[sortId] = sort 
      }
      else { 
        deletedSheetSortIds.push(sort.id) 
      }
    })

    // All Sheet Views
    const nextAllSheetViews = clone(allSheetViews)
    Object.keys(allSheetViews).forEach(sheetViewId => {
      const sheetView = allSheetViews[sheetViewId]
      nextAllSheetViews[sheetViewId] = {
        ...sheetView,
        visibleColumns: sheetView.visibleColumns.filter(sheetColumnId => !columnIdsToDelete.has(sheetColumnId)),
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
      mutation.deleteSheetColumns([ ...columnIdsToDelete ])
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
      mutation.restoreSheetColumns([ ...columnIdsToDelete ])
    }
    
    dispatch(createHistoryStep({ actions, undoActions }))
    actions()
	}
}