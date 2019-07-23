//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { orderBy } from 'lodash'

import clone from '@/utils/clone'
import { mutation } from '@app/api'

import { AppState } from '@app/state'
import { Columns, Rows, Sheet, SheetFromServer, Sort, SortOrder, Sorts, VisibleRows } from '@app/state/sheet/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = CreateSort | DeleteSort | LoadSheet | UpdateSheet | UpdateSheetCell

//-----------------------------------------------------------------------------
// Resolvers
//-----------------------------------------------------------------------------
const resolveVisibleRows = (rows: Rows, sorts?: Sorts) => {
  const sortBy = sorts && sorts.map(sort => {
    return (rowId: string) => {
      const value = rows[rowId].cells.find(cell => cell.columnId === sort.columnId).value
      return isNaN(Number(value)) ? value : Number(value)
    }
  })
  const sortOrder = sorts && sorts.map(sort => sort.order === 'ASC' ? 'asc' : 'desc')

  return orderBy(Object.keys(rows), sortBy, sortOrder)
}

const resolveVisibleColumns = (columns: Columns) => {
  return orderBy(Object.keys(columns), (columnId: string) => columns[columnId].position)
}

//-----------------------------------------------------------------------------
// Create Sort
//-----------------------------------------------------------------------------
export const CREATE_SORT = 'CREATE_SORT'
interface CreateSort {
	type: typeof CREATE_SORT
}

export const createSort = (sheetId: string, newSort: Sort): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      rows,
      sorts
    } = getState().sheet[sheetId]
    const nextSorts = [...sorts, newSort]
    const nextVisibleRows = resolveVisibleRows(rows, nextSorts)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
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
      sorts
    } = getState().sheet[sheetId]
    const nextSorts = sorts.filter(sort => sort.columnId !== columnId)
    const nextVisibleRows = resolveVisibleRows(rows, nextSorts)
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
        visibleRows: resolveVisibleRows(normalizedRows),
        sorts: []
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
  sorts?: Sorts
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

//-----------------------------------------------------------------------------
// Update Sort
//-----------------------------------------------------------------------------
export interface SortUpdates {
  order?: SortOrder
}

export const updateSort = (sheetId: string, sortId: string, updates: SortUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      rows,
      sorts
    } = getState().sheet[sheetId]
    const sortIndex = sorts.findIndex(sort => sort.id === sortId)
    const nextSorts = clone(sorts)
    if(sortIndex > -1) {
      nextSorts[sortIndex] = { ...nextSorts[sortIndex], ...updates }
    }
    const nextVisibleRows = resolveVisibleRows(rows, nextSorts)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
	}
}
