//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { orderBy } from 'lodash'

import clone from '@/utils/clone'
import { mutation } from '@app/api'

import { AppState } from '@app/state'
import { Columns, SheetFilter, SheetFilters, Rows, Sheet, SheetFromServer, SheetSort, SheetSortOrder, SheetSorts, VisibleRows, SheetFilterType } from '@app/state/sheet/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = 
  CreateFilter | DeleteFilter |
  CreateSort | DeleteSort | 
  LoadSheet | UpdateSheet | UpdateSheetCell

//-----------------------------------------------------------------------------
// Resolvers
//-----------------------------------------------------------------------------
const resolveValue = (value: string) => {
  const filteredValue = value.replace('%', '')
  return isNaN(Number(filteredValue)) ? filteredValue : Number(filteredValue)
}

const resolveFilter = (cellValue: string, filterValue: string, type: SheetFilterType) => {
  switch (type) {
    case '=': {
      return resolveValue(cellValue) === resolveValue(filterValue)
    }
    case '>': {
      return resolveValue(cellValue) > resolveValue(filterValue)
    }
    case '>=': {
      return resolveValue(cellValue) >= resolveValue(filterValue)
    }
    case '<': {
      return resolveValue(cellValue) < resolveValue(filterValue)
    }
    case '<=': {
      return resolveValue(cellValue) <= resolveValue(filterValue)
    }
  }
}

const resolveVisibleRows = (rows: Rows, sorts?: SheetSorts, filters?: SheetFilters) => {

  const rowIds: string[] = Object.keys(rows)

  const filteredRowIds: string[] = !filters ? rowIds : rowIds.map(rowId => {
    const row = rows[rowId]
    let passesFilter = true
    filters.forEach(filter => {
      const cellValue = row.cells.find(cell => cell.columnId === filter.columnId).value
      if(!resolveFilter(cellValue, filter.value, filter.type)) { passesFilter = false }
    })
    return passesFilter ? rowId : undefined
  }).filter(Boolean)

  const sortBy = sorts && sorts.map(sort => {
    return (rowId: string) => {
      const value = rows[rowId].cells.find(cell => cell.columnId === sort.columnId).value
      return resolveValue(value)
    }
  })
  const sortOrder = sorts && sorts.map(sort => sort.order === 'ASC' ? 'asc' : 'desc')

  return orderBy(filteredRowIds, sortBy, sortOrder)
}

const resolveVisibleColumns = (columns: Columns) => {
  return orderBy(Object.keys(columns), (columnId: string) => columns[columnId].position)
}

//-----------------------------------------------------------------------------
// Create Filter
//-----------------------------------------------------------------------------
export const CREATE_FILTER = 'CREATE_FILTER'
interface CreateFilter {
	type: typeof CREATE_FILTER
}

let createFilterUpdateVisibleRowsTimeout: number = null
export const createFilter = (sheetId: string, newFilter: SheetFilter): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    // Update Filters
    const {
      filters
    } = getState().sheet[sheetId]
    const nextFilters = [...filters, newFilter]
    dispatch(updateSheetReducer(sheetId, {
      filters: nextFilters
    }))
    // Save to Server
    mutation.createSheetFilter({ sheetId: sheetId, ...newFilter})
    // Update Visible Rows
    clearTimeout(createFilterUpdateVisibleRowsTimeout)
    createFilterUpdateVisibleRowsTimeout = setTimeout(() => {
      const {
        filters,
        rows,
        sorts
      } = getState().sheet[sheetId]
      const nextVisibleRows = resolveVisibleRows(rows, sorts, filters)
      dispatch(updateSheetReducer(sheetId, {
        visibleRows: nextVisibleRows
      }))
    }, 50)
	}
}

//-----------------------------------------------------------------------------
// Delete Filter
//-----------------------------------------------------------------------------
export const DELETE_FILTER = 'DELETE_FILTER'
interface DeleteFilter {
	type: typeof DELETE_FILTER
}

export const deleteFilter = (sheetId: string, filterId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      rows,
      sorts
    } = getState().sheet[sheetId]
    const nextFilters = filters.filter(filter => filter.id !== filterId)
    const nextVisibleRows = resolveVisibleRows(rows, sorts, nextFilters)
    dispatch(updateSheetReducer(sheetId, {
      filters: nextFilters,
      visibleRows: nextVisibleRows
    }))
    mutation.deleteSheetFilter(filterId)
	}
}

//-----------------------------------------------------------------------------
// Update Filter
//-----------------------------------------------------------------------------
export interface SheetFilterUpdates {
}

export const updateFilter = (sheetId: string, filterId: string, updates: SheetFilterUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      rows,
      filters
    } = getState().sheet[sheetId]
    const filterIndex = filters.findIndex(filter => filter.id === filterId)
    const nextFilters = clone(filters)
    if(filterIndex > -1) {
      nextFilters[filterIndex] = { ...nextFilters[filterIndex], ...updates }
    }
    const nextVisibleRows = resolveVisibleRows(rows, nextFilters)
    dispatch(updateSheetReducer(sheetId, {
      filters: nextFilters,
      visibleRows: nextVisibleRows
    }))
	}
}

//-----------------------------------------------------------------------------
// Create Sort
//-----------------------------------------------------------------------------
export const CREATE_SORT = 'CREATE_SORT'
interface CreateSort {
	type: typeof CREATE_SORT
}

export const createSort = (sheetId: string, newSort: SheetSort): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      rows,
      sorts,
      filters
    } = getState().sheet[sheetId]
    const nextSorts = [...sorts, newSort]
    const nextVisibleRows = resolveVisibleRows(rows, nextSorts, filters)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
    mutation.createSheetSort({ sheetId: sheetId, ...newSort })
	}
}

//-----------------------------------------------------------------------------
// Delete Sort
//-----------------------------------------------------------------------------
export const DELETE_SORT = 'DELETE_SORT'
interface DeleteSort {
	type: typeof DELETE_SORT
}

export const deleteSort = (sheetId: string, columnId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      rows,
      sorts,
      filters
    } = getState().sheet[sheetId]
    const sortToDelete = sorts.find(sort => sort.columnId === columnId)
    const nextSorts = sorts.filter(sort => sort.id !== sortToDelete.id)
    const nextVisibleRows = resolveVisibleRows(rows, nextSorts, filters)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
    mutation.deleteSheetSort(sortToDelete.id)
	}
}

//-----------------------------------------------------------------------------
// Update Sort
//-----------------------------------------------------------------------------
export interface SheetSortUpdates {
  order?: SheetSortOrder
}

export const updateSort = (sheetId: string, sortId: string, updates: SheetSortUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      rows,
      sorts,
      filters
    } = getState().sheet[sheetId]
    const sortIndex = sorts.findIndex(sort => sort.id === sortId)
    const nextSorts = clone(sorts)
    if(sortIndex > -1) {
      nextSorts[sortIndex] = { ...nextSorts[sortIndex], ...updates }
    }
    const nextVisibleRows = resolveVisibleRows(rows, nextSorts, filters)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
	}
}


//-----------------------------------------------------------------------------
// Load Sheet
//-----------------------------------------------------------------------------
export const LOAD_SHEET = 'LOAD_SHEET'
interface LoadSheet {
	type: typeof LOAD_SHEET
	sheet: Sheet
}

export const loadSheet = (sheet: SheetFromServer): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    const normalizedRows: Rows = {}
    const normalizedColumns: Columns = {}
    sheet.rows.forEach(row => { normalizedRows[row.id] = row })
    sheet.columns.forEach(column => { normalizedColumns[column.id] = column })
		dispatch(
			loadSheetReducer({
				id: sheet.id,
        columns: normalizedColumns,
        visibleColumns: resolveVisibleColumns(normalizedColumns),
        rows: normalizedRows,
        visibleRows: resolveVisibleRows(normalizedRows, sheet.sorts, sheet.filters),
        sorts: sheet.sorts,
        filters: sheet.filters
			})
		)
	}
}

export const loadSheetReducer = (sheet: Sheet): SheetActions => {
	return {
		type: LOAD_SHEET,
		sheet,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet
//-----------------------------------------------------------------------------
export const UPDATE_SHEET = 'UPDATE_SHEET'
interface UpdateSheet {
	type: typeof UPDATE_SHEET
	sheetId: string
	updates: SheetUpdates
}
export interface SheetUpdates {
  filters?: SheetFilters
  sorts?: SheetSorts
  visibleRows?: VisibleRows
}

export const updateSheet = (sheetId: string, updates: SheetUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetReducer(sheetId, updates))
	}
}

export const updateSheetReducer = (sheetId: string, updates: SheetUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET,
		sheetId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CELL = 'UPDATE_SHEET_CELL'
interface UpdateSheetCell {
	type: typeof UPDATE_SHEET_CELL
	sheetId: string
	cellId: string
	updates: SheetCellUpdates
}
export interface SheetCellUpdates {
	value?: string
}

export const updateSheetCell = (sheetId: string, cellId: string, updates: SheetCellUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
		mutation.updateSheetCell(cellId, updates).then(() => {
			dispatch(updateSheetCellReducer(sheetId, cellId, updates))
		})
	}
}

export const updateSheetCellReducer = (sheetId: string, cellId: string, updates: SheetCellUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		sheetId,
		cellId,
		updates,
	}
}
