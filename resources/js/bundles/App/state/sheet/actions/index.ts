//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@app/api'

import { 
  ISheet, ISheetUpdates,
  ISheetActiveUpdates, 
  IAllSheetColumns, ISheetColumnUpdates,
  IAllSheetRows, ISheetRowUpdates, 
  IAllSheetCells, ISheetCellUpdates,
  ISheetClipboard,
  IAllSheetFilters, ISheetFilterUpdates,
  IAllSheetGroups, ISheetGroupUpdates,
  IAllSheetSorts, ISheetSortUpdates,
  IAllSheetViews, ISheetViewUpdates,
  IAllSheetNotes, IAllSheetCellNotes
} from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Thunk Actions
//-----------------------------------------------------------------------------
export { loadSheet } from '@app/state/sheet/actions/loadSheet'
export { loadSheetView } from '@app/state/sheet/actions/loadSheetView'

export { createSheet } from '@app/state/sheet/actions/createSheet'
export { createSheetFromCsv } from '@app/state/sheet/actions/createSheetFromCsv'
export { createSheetColumn } from '@app/state/sheet/actions/createSheetColumn'
export { createSheetColumnBreak } from '@app/state/sheet/actions/createSheetColumnBreak'
export { createSheetFilter } from '@app/state/sheet/actions/createSheetFilter'
export { createSheetGroup } from '@app/state/sheet/actions/createSheetGroup'
export { createSheetRows } from '@/bundles/App/state/sheet/actions/createSheetRows'
export { createSheetSort } from '@app/state/sheet/actions/createSheetSort'
export { createSheetLink } from '@/bundles/App/state/sheet/actions/createSheetLink'
export { createSheetView } from '@app/state/sheet/actions/createSheetView'
export { createSheetCellNote } from '@app/state/sheet/actions/createSheetCellNote'

export { deleteSheetColumn } from '@app/state/sheet/actions/deleteSheetColumn'
export { deleteSheetColumnBreak } from '@app/state/sheet/actions/deleteSheetColumnBreak'
export { deleteSheetFilter } from '@app/state/sheet/actions/deleteSheetFilter'
export { deleteSheetGroup } from '@app/state/sheet/actions/deleteSheetGroup'
export { deleteSheetRow } from '@app/state/sheet/actions/deleteSheetRow'
export { deleteSheetSort } from '@app/state/sheet/actions/deleteSheetSort'
export { deleteSheetView } from '@app/state/sheet/actions/deleteSheetView'
export { deleteSheetCellNote } from '@app/state/sheet/actions/deleteSheetCellNote'

export { updateSheetCell } from '@app/state/sheet/actions/updateSheetCell'
export { updateSheetColumn } from '@app/state/sheet/actions/updateSheetColumn'
export { updateSheetFilter } from '@app/state/sheet/actions/updateSheetFilter'
export { updateSheetGroup } from '@app/state/sheet/actions/updateSheetGroup'
export { updateSheetSort } from '@app/state/sheet/actions/updateSheetSort'
export { updateSheetStyles } from '@app/state/sheet/actions/updateSheetStyles'
export { updateSheetView } from '@app/state/sheet/actions/updateSheetView'

export { resetSheetView } from '@app/state/sheet/actions/resetSheetView'

export { refreshSheetVisibleRows } from '@app/state/sheet/actions/refreshSheetVisibleRows'

export { copySheetRange } from '@app/state/sheet/actions/copySheetRange'
export { cutSheetRange } from '@app/state/sheet/actions/cutSheetRange'
export { pasteSheetRange } from '@app/state/sheet/actions/pasteSheetRange'

export { hideSheetColumn } from '@app/state/sheet/actions/hideSheetColumn'
export { showSheetColumn } from '@app/state/sheet/actions/showSheetColumn'

export { allowSelectedCellEditing } from '@app/state/sheet/actions/allowSelectedCellEditing'
export { allowSelectedCellNavigation } from '@app/state/sheet/actions/allowSelectedCellNavigation'
export { preventSelectedCellEditing } from '@app/state/sheet/actions/preventSelectedCellEditing'
export { preventSelectedCellNavigation } from '@app/state/sheet/actions/preventSelectedCellNavigation'
export { clearSheetSelection } from '@app/state/sheet/actions/clearSheetSelection'
export { selectSheetColumns } from '@app/state/sheet/actions/selectSheetColumns'
export { selectSheetRows } from '@app/state/sheet/actions/selectSheetRows'
export { updateSheetSelectionFromArrowKey } from '@app/state/sheet/actions/updateSheetSelectionFromArrowKey'
export { updateSheetSelectionFromCellClick } from '@app/state/sheet/actions/updateSheetSelectionFromCellClick'

//-----------------------------------------------------------------------------
// Sheet Actions
//-----------------------------------------------------------------------------
export type ISheetActions = 
  ILoadSheet | IUpdateSheet | 
  IUpdateSheetActive |
  IUpdateSheetCell | ISetAllSheetCells | 
  IUpdateSheetClipboard |
  IUpdateSheetColumn | ISetAllSheetColumns | 
  IUpdateSheetFilter | ISetAllSheetFilters |
  IUpdateSheetGroup | ISetAllSheetGroups |
  IUpdateSheetRow | ISetAllSheetRows | 
  IUpdateSheetSort | ISetAllSheetSorts |
  IUpdateSheetView | ISetAllSheetViews |
  ISetAllSheetCellNotes | ISetAllSheetNotes

//-----------------------------------------------------------------------------
// Load Sheet - Moved
//-----------------------------------------------------------------------------
export const LOAD_SHEET = 'LOAD_SHEET'
interface ILoadSheet {
  type: typeof LOAD_SHEET
  sheet: ISheet
  cells: IAllSheetCells
  columns: IAllSheetColumns
  filters: IAllSheetFilters
  groups: IAllSheetGroups
  rows: IAllSheetRows
  sorts: IAllSheetSorts
  views: IAllSheetViews
  cellNotes: IAllSheetCellNotes
  notes: IAllSheetNotes
}

export const loadSheetReducer = (
  sheet: ISheet, 
  cells: IAllSheetCells, 
  columns: IAllSheetColumns, 
  filters: IAllSheetFilters, 
  groups: IAllSheetGroups, 
  rows: IAllSheetRows, 
  sorts: IAllSheetSorts, 
  views: IAllSheetViews,
  cellNotes: IAllSheetCellNotes,
  notes: IAllSheetNotes,
): ISheetActions => {
  return {
    type: LOAD_SHEET,
    columns,
    rows,
    sheet,
    cells,
    filters,
    groups,
    sorts,
    views,
    cellNotes,
    notes
  }
}

//-----------------------------------------------------------------------------
// Set All Sheet Cells
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELLS = 'SET_ALL_SHEET_CELLS'
interface ISetAllSheetCells {
  type: typeof SET_ALL_SHEET_CELLS,
  nextAllSheetCells: IAllSheetCells
}

export const setAllSheetCells = (nextAllSheetCells: IAllSheetCells): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELLS,
    nextAllSheetCells,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Columns
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_COLUMNS = 'SET_ALL_SHEET_COLUMNS'
interface ISetAllSheetColumns {
  type: typeof SET_ALL_SHEET_COLUMNS,
  nextAllSheetColumns: IAllSheetColumns
}

export const setAllSheetColumns = (nextAllSheetColumns: IAllSheetColumns): ISheetActions => {
	return {
		type: SET_ALL_SHEET_COLUMNS,
    nextAllSheetColumns,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Filters
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_FILTERS = 'SET_ALL_SHEET_FILTERS'
interface ISetAllSheetFilters {
  type: typeof SET_ALL_SHEET_FILTERS,
  nextAllSheetFilters: IAllSheetFilters
}

export const setAllSheetFilters = (nextAllSheetFilters: IAllSheetFilters): ISheetActions => {
	return {
		type: SET_ALL_SHEET_FILTERS,
    nextAllSheetFilters,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Groups
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_GROUPS = 'SET_ALL_SHEET_GROUPS'
interface ISetAllSheetGroups {
  type: typeof SET_ALL_SHEET_GROUPS,
  nextAllSheetGroups: IAllSheetGroups
}

export const setAllSheetGroups = (nextAllSheetGroups: IAllSheetGroups): ISheetActions => {
	return {
		type: SET_ALL_SHEET_GROUPS,
    nextAllSheetGroups,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Rows
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_ROWS = 'SET_ALL_SHEET_ROWS'
interface ISetAllSheetRows {
  type: typeof SET_ALL_SHEET_ROWS,
  nextAllSheetRows: IAllSheetRows
}

export const setAllSheetRows = (nextAllSheetRows: IAllSheetRows): ISheetActions => {
	return {
		type: SET_ALL_SHEET_ROWS,
    nextAllSheetRows,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Sorts
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_SORTS = 'SET_ALL_SHEET_SORTS'
interface ISetAllSheetSorts {
  type: typeof SET_ALL_SHEET_SORTS,
  nextAllSheetSorts: IAllSheetSorts
}

export const setAllSheetSorts = (nextAllSheetSorts: IAllSheetSorts): ISheetActions => {
	return {
		type: SET_ALL_SHEET_SORTS,
    nextAllSheetSorts,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Views
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_VIEWS = 'SET_ALL_SHEET_VIEWS'
interface ISetAllSheetViews {
  type: typeof SET_ALL_SHEET_VIEWS,
  nextAllSheetViews: IAllSheetViews
}

export const setAllSheetViews = (nextAllSheetViews: IAllSheetViews): ISheetActions => {
	return {
		type: SET_ALL_SHEET_VIEWS,
    nextAllSheetViews,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Cell Notes
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_CELL_NOTES = 'SET_ALL_SHEET_CELL_NOTES'
interface ISetAllSheetCellNotes {
  type: typeof SET_ALL_SHEET_CELL_NOTES,
  nextAllSheetCellNotes: IAllSheetCellNotes
}

export const setAllSheetCellNotes = (nextAllSheetCellNotes: IAllSheetCellNotes): ISheetActions => {
	return {
		type: SET_ALL_SHEET_CELL_NOTES,
    nextAllSheetCellNotes,
	}
}

//-----------------------------------------------------------------------------
// Set All Sheet Notes
//-----------------------------------------------------------------------------
export const SET_ALL_SHEET_NOTES = 'SET_ALL_SHEET_NOTES'
interface ISetAllSheetNotes {
  type: typeof SET_ALL_SHEET_NOTES,
  nextAllSheetNotes: IAllSheetNotes
}

export const setAllSheetNotes = (nextAllSheetNotes: IAllSheetNotes): ISheetActions => {
	return {
		type: SET_ALL_SHEET_NOTES,
    nextAllSheetNotes,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet
//-----------------------------------------------------------------------------
export const UPDATE_SHEET = 'UPDATE_SHEET'
interface IUpdateSheet {
  type: typeof UPDATE_SHEET
  sheetId: string
  updates: ISheetUpdates
}

export const updateSheet = (sheetId: string, updates: ISheetUpdates, skipDatabaseUpdate: boolean = false): ISheetActions => {
  !skipDatabaseUpdate && mutation.updateSheet(sheetId, updates)
  return {
    type: UPDATE_SHEET,
    sheetId,
    updates,
  }
}

//-----------------------------------------------------------------------------
// Update Sheet Active
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ACTIVE = 'UPDATE_SHEET_ACTIVE'
interface IUpdateSheetActive {
  type: typeof UPDATE_SHEET_ACTIVE,
  updates: ISheetActiveUpdates
}

export const updateSheetActive = (updates: ISheetActiveUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_ACTIVE,
    updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cell
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CELL = 'UPDATE_SHEET_CELL'
interface IUpdateSheetCell {
	type: typeof UPDATE_SHEET_CELL
	cellId: string
	updates: ISheetCellUpdates
}

export const updateSheetCellReducer = (cellId: string, updates: ISheetCellUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		cellId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Clipboard
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_CLIPBOARD = 'UPDATE_SHEET_CLIPBOARD'
interface IUpdateSheetClipboard {
  type: typeof UPDATE_SHEET_CLIPBOARD
  nextSheetClipboard: ISheetClipboard
}
export const updateSheetClipboard = (nextSheetClipboard: ISheetClipboard): ISheetActions => {
  return {
    type: UPDATE_SHEET_CLIPBOARD,
    nextSheetClipboard
  }
}

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMN = 'UPDATE_SHEET_COLUMN'
interface IUpdateSheetColumn {
	type: typeof UPDATE_SHEET_COLUMN
  columnId: string
	updates: ISheetColumnUpdates
}

export const updateSheetColumnReducer = (columnId: string, updates: ISheetColumnUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_COLUMN,
    columnId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filter
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_FILTER = 'UPDATE_SHEET_FILTER'
interface IUpdateSheetFilter {
	type: typeof UPDATE_SHEET_FILTER
  filterId: string
	updates: ISheetFilterUpdates
}

export const updateSheetFilterReducer = (filterId: string, updates: ISheetFilterUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_FILTER,
    filterId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Group - Moved
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUP = 'UPDATE_SHEET_GROUP'
interface IUpdateSheetGroup {
	type: typeof UPDATE_SHEET_GROUP
  groupId: string
	updates: ISheetGroupUpdates
}

export const updateSheetGroupReducer = (groupId: string, updates: ISheetGroupUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_GROUP,
    groupId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Row - Keep
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROW = 'UPDATE_SHEET_ROW'
interface IUpdateSheetRow {
	type: typeof UPDATE_SHEET_ROW
  rowId: string
	updates: ISheetRowUpdates
}

export const updateSheetRow = (rowId: string, updates: ISheetRowUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_ROW,
    rowId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort - Moved
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORT = 'UPDATE_SHEET_SORT'
interface IUpdateSheetSort {
	type: typeof UPDATE_SHEET_SORT
  sortId: string
	updates: ISheetSortUpdates
}

export const updateSheetSortReducer = (sortId: string, updates: ISheetSortUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_SORT,
    sortId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort - Moved
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_VIEW = 'UPDATE_SHEET_VIEW'
interface IUpdateSheetView {
	type: typeof UPDATE_SHEET_VIEW
  sheetViewId: string
	updates: ISheetViewUpdates
}

export const updateSheetViewReducer = (sheetViewId: string, updates: ISheetViewUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_VIEW,
    sheetViewId,
		updates,
	}
}