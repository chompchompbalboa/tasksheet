//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { mutation } from '@app/api'

import { AppState } from '@app/state'
import { 
  Sheet, SheetFromServer, SheetUpdates,
  SheetColumns, SheetColumnUpdates,
  SheetRows, 
  SheetCellUpdates,
  SheetFilter,
  SheetGroup, SheetGroupUpdates,
  SheetSort, SheetSortUpdates
} from '@app/state/sheet/types'
import { FileType } from '@app/state/folder/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

import { updateFiles, updateFolders } from '@app/state/folder/actions'
import { updateTabs } from '@app/state/tab/actions'

import { resolveVisibleColumns, resolveVisibleRows} from '@app/state/sheet/resolvers'

import { defaultRow } from '@app/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = 
  LoadSheet | UpdateSheet | 
  UpdateSheetCell |
  UpdateSheetColumn |
  DeleteSheetFilter | UpdateSheetFilter | UpdateSheetFilters |
  DeleteSheetGroup | UpdateSheetGroup | UpdateSheetGroups |
  UpdateSheetRows | 
  DeleteSheetSort | UpdateSheetSort | UpdateSheetSorts 

//-----------------------------------------------------------------------------
// Create Sheet Filter
//-----------------------------------------------------------------------------
export const createSheetFilter = (sheetId: string, newFilter: SheetFilter): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextFilters = { ...filters, [newFilter.id]: newFilter }
    const nextSheetFilters = [ ...sheet.filters, newFilter.id ]
    const nextSheetVisibleRows = resolveVisibleRows({ sheet, filters: nextSheetFilters }, rows, nextFilters, groups, sorts)
    batch(() => {
      dispatch(updateSheetFilters({ ...filters, [newFilter.id]: newFilter }))
      dispatch(updateSheetReducer(sheetId, {
        filters: nextSheetFilters,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetFilter(newFilter)
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Group
//-----------------------------------------------------------------------------
export const createSheetGroup = (sheetId: string, newGroup: SheetGroup): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextGroups = { ...groups, [newGroup.id]: newGroup }
    const nextSheetGroups = [ ...sheet.groups, newGroup.id ]
    const nextSheetVisible = resolveVisibleRows({ ...sheet, groups: nextSheetGroups }, rows, filters, nextGroups, sorts)
    batch(() => {
      dispatch(updateSheetGroups({ ...groups, [newGroup.id]: newGroup }))
      dispatch(updateSheetReducer(sheetId, {
        groups: nextSheetGroups,
        visibleRows: nextSheetVisible
      }))
    })
    mutation.createSheetGroup(newGroup)
	}
}
//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const createSheetRow = (sheetId: string, sourceSheetId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      columns,
      rows,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const newRow = defaultRow(sourceSheetId !== null ? sourceSheetId : sheetId, createUuid(), sheet.columns)
    const nextRows = { ...rows, [newRow.id]: newRow }
    const nextSheetRows = [ ...sheet.rows, newRow.id ]
    const nextSheetVisibleRows = [ newRow.id, ...sheet.visibleRows ]
    batch(() => {
      dispatch(updateSheetRows({ ...rows, [newRow.id]: newRow }))
      dispatch(updateSheetReducer(sheetId, {
        rows: nextSheetRows,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetRow(newRow)
	}
}

//-----------------------------------------------------------------------------
// Create Sheet Sort
//-----------------------------------------------------------------------------
export const createSheetSort = (sheetId: string, newSort: SheetSort): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet
    const sheet = sheets[sheetId]
    const nextSorts = { ...sorts, [newSort.id]: newSort }
    const nextSheetSorts = [ ...sheet.sorts, newSort.id ]
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, sorts: nextSheetSorts }, rows, filters, groups, nextSorts)
    batch(() => {
      dispatch(updateSheetSorts({ ...sorts, [newSort.id]: newSort }))
      dispatch(updateSheetReducer(sheetId, {
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetSort(newSort)
	}
}


//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const createSheetView = (sheetId: string, viewName: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      folder: { activeFolderPath, files, folders },
      sheet: { sheets, filters, groups, sorts },
      tab: { tabs }
    } = getState()
    const sourceSheet = sheet.sheets[sheetId]
    const fileId = Object.keys(files).find(fileId => files[fileId].typeId === sheetId)
    const folderId = activeFolderPath[activeFolderPath.length - 1]
    const newFileId = createUuid()
    const newSheetViewId = createUuid()
    // Filters
    const newSheetViewFilters = {}
    sourceSheet.filters.forEach(filterId => {
      const newFilterId = createUuid()
      newSheetViewFilters[newFilterId] = { ...filters[filterId], id: newFilterId, sheetId: newSheetViewId })
    })
    // Groups
    const newSheetViewGroups = {}
    sourceSheet.groups.forEach(groupId => {
      const newGroupId = createUuid()
      newSheetViewGroups[newGroupId] = { ...groups[groupId], id: newGroupId, sheetId: newSheetViewId })
    })
    // Sorts
    const newSheetViewSorts = {}
    sourceSheet.sorts.forEach(sortId => {
      const newSortId = createUuid()
      newSheetViewSorts[newSortId] = { ...sorts[sortId], id: newSortId, sheetId: newSheetViewId })
    })
  // Update sheets
    dispatch(loadSheetReducer(
      sheet: {
        id: newSheetViewId,
        sourceSheetId: sourceSheet.id,
        fileType: sourceSheet.fileType,
        columns: clone(sourceSheet.columns),
        visibleColumns: clone(sourceSheet.visibleColumns),
        rows: clone(sourceSheet.rows),
        visibleRows: clone(sourceSheet.visibleRows),
      },
      cells: null,
      columns: null,
      filters: newSheetViewFilters,
      groups: newSheetViewGroups,
      rows: null,
      sorts: newSheetViewSorts,
    ))
    // Update folders and files
    const newFile = {
      ...files[fileId],
      id: newFileId,
      folderId: folderId,
      type: 'SHEET_VIEW' as FileType, 
      name: viewName,
      typeId: newSheetViewId
    }
    dispatch(updateFiles({
      ...files,
      [newFileId]: newFile
    }))
    dispatch(updateFolders({
      ...folders,
      [folderId]: {
        ...folders[folderId],
        files: [ ...folders[folderId].files, newFileId ]
      }
    }))
    // Update open tabs
    dispatch(updateTabs([ ...tabs, newFileId]))
    // Create the file on the server
    mutation.createFile(newFile)
    // Create the sheet view on the server
    mutation.createSheetView({
      id: newSheetViewId,
      sourceSheetId: sourceSheet.id,
      filters: newSheetViewFilters,
      groups: newSheetViewGroups,
      sorts: newSheetViewSorts
    })
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Filter
//-----------------------------------------------------------------------------
export const DELETE_SHEET_FILTER = 'DELETE_SHEET_FILTER'
interface DeleteSheetFilter {
	type: typeof DELETE_SHEET_FILTER
}

export const deleteSheetFilter = (sheetId: string, filterId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet
    const sheet = sheets[sheet.id]
    const { [filterId], ...nextFilters } = filters
    const nextSheetFilters = sheet.filters.filter(filter => filter.id !== filterId)
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, filters: nextSheetFilters}, rows, nextFilters, groups, sorts)
    batch(() => {
      dispatch(updateSheetFilters(nextFilters))
      dispatch(updateSheetReducer(sheetId, {
        filters: nextSheetFilters,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetFilter(filterId)
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Group
//-----------------------------------------------------------------------------
export const DELETE_SHEET_GROUP = 'DELETE_SHEET_GROUP'
interface DeleteSheetGroup {
	type: typeof DELETE_SHEET_GROUP
}

export const deleteSheetGroup = (sheetId: string, columnId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      sheets,
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet
    const sheet = sheets[sheet.id]
    const { [groupId], ...nextGroups } = groups
    const nextSheetGroups = sheet.groups.group(group => group.id !== groupId)
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, groups: nextSheetGroups}, rows, filters, nextGroups, sorts)
    batch(() => {
      dispatch(updateSheetGroups(nextGroups))
      dispatch(updateSheetReducer(sheetId, {
        groups: nextSheetGroups,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetGroup(groupId)
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Sort
//-----------------------------------------------------------------------------
export const DELETE_SHEET_SORT = 'DELETE_SHEET_SORT'
interface DeleteSheetSort {
	type: typeof DELETE_SHEET_SORT
}

export const deleteSheetSort = (sheetId: string, columnId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet
    const sheet = sheets[sheet.id]
    const { [sortId], ...nextSorts } = sorts
    const nextSheetSorts = sheet.sorts.sort(sort => sort.id !== sortId)
    const nextSheetVisibleRows = resolveVisibleRows({ ...sheet, sorts: nextSheetSorts}, rows, filters, groups, nextSorts)
    batch(() => {
      dispatch(updateSheetSorts(nextSorts))
      dispatch(updateSheetReducer(sheetId, {
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetSort(sortId)
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
    // Rows and cells
    const normalizedRows: SheetRows = {}
    const normalizedCells: SheetCells = {}
    sheet.rows.forEach(row => { 
      normalizedRows[row.id] = row 
      row.cells.forEach(cell => {
        normalizedCells[cell.id] = cell
      })
    })
    // Columns
    const normalizedColumns: SheetColumns = {}
    sheet.columns.forEach(column => { normalizedColumns[column.id] = column })
    // Filters
    const normalizedFilters: SheetFilters = {}
    sheet.filters.forEach(filter => { normalizedFilters[filter.id] = filter })
    // Groups
    const normalizedGroups: SheetGroups = {}
    sheet.groups.forEach(group => { normalizedGroups[group.id] = group })
    // Sorts
    const normalizedSorts: SheetSorts = {}
    sheet.sorts.forEach(sort => { normalizedSorts[sort.id] = sort })
		dispatch(
			loadSheetReducer(
        sheet: {
          id: sheet.id,
          sourceSheetId: sheet.sourceSheetId,
          fileType: sheet.fileType,
          columns: sheet.columns.map(column => column.id),
          visibleColumns: resolveVisibleColumns(normalizedColumns),
          rows: sheet.rows.map(row => row.id),
          visibleRows: resolveVisibleRows(normalizedRows, sheet.filters, sheet.groups, sheet.sorts),
        },
        cells: normalizedCells,
        columns: normalizedColumns,
        filters: normalizedFilters,
        groups: sheet.groups,
        rows: normalizedRows,
        sorts: sheet.sorts,
			)
		)
	}
}

export const loadSheetReducer = (sheet: Sheet, cells: SheetCells, columns: SheetColumns, filters: SheetFilters, groups: SheetGroups, rows: SheetRows, sorts: SheetSorts): SheetActions => {
	return {
		type: LOAD_SHEET,
		sheet,
    cells,
    columns,
    filters,
    groups,
    rows,
    sorts,
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
	cellId: string
	updates: SheetCellUpdates
}

export const updateSheetCell = (cellId: string, updates: SheetCellUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetCellReducer(cellId, updates))
		mutation.updateSheetCell(cellId, updates)
	}
}

export const updateSheetCellReducer = (cellId: string, updates: SheetCellUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		cellId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMN = 'UPDATE_SHEET_COLUMN'
interface UpdateSheetColumn {
	type: typeof UPDATE_SHEET_COLUMN
  columnId: string
	updates: SheetColumnUpdates
}

export const updateSheetColumn = (columnId: string, updates: SheetColumnUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetColumnReducer(columnId, updates))
		mutation.updateSheetColumn(columnId, updates)
	}
}

export const updateSheetColumnReducer = (columnId: string, updates: SheetColumnUpdates): SheetActions => {
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
interface UpdateSheetFilter {
	type: typeof UPDATE_SHEET_FILTER
  filterId: string
	updates: SheetFilterUpdates
}

export const updateSheetFilter = (filterId: string, updates: SheetFilterUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetFilterReducer(filterId, updates))
		mutation.updateSheetFilter(filterId, updates)
	}
}

export const updateSheetFilterReducer = (filterId: string, updates: SheetFilterUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_FILTER,
    filterId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filters
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_FILTERS = 'UPDATE_SHEET_FILTERS'
interface UpdateSheetFilters {
  type: typeof UPDATE_SHEET_FILTERS,
  nextFilters: SheetFilters
}

export const updateSheetFilters = (nextFilters: SheetFilters): SheetActions => {
	return {
		type: UPDATE_SHEET_FILTERS,
    nextSheetFilters,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUP = 'UPDATE_SHEET_GROUP'
interface UpdateSheetGroup {
	type: typeof UPDATE_SHEET_GROUP
  groupId: string
	updates: SheetGroupUpdates
}

export const updateSheetGroup = (groupId: string, updates: SheetGroupUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetGroupReducer(groupId, updates))
		mutation.updateSheetGroup(groupId, updates)
	}
}

export const updateSheetGroupReducer = (groupId: string, updates: SheetGroupUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_GROUP,
    groupId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Groups
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUPS = 'UPDATE_SHEET_GROUPS'
interface UpdateSheetGroups {
  type: typeof UPDATE_SHEET_GROUPS,
  nextGroups: SheetGroups
}

export const updateSheetGroups = (nextGroups: SheetGroups): SheetActions => {
	return {
		type: UPDATE_SHEET_GROUPS,
    nextSheetGroups,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Row
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROW = 'UPDATE_SHEET_ROW'
interface UpdateSheetRow {
	type: typeof UPDATE_SHEET_ROW
  rowId: string
	updates: SheetRowUpdates
}

export const updateSheetRow = (rowId: string, updates: SheetRowUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetRowReducer(rowId, updates))
		mutation.updateSheetRow(rowId, updates)
	}
}

export const updateSheetRowReducer = (rowId: string, updates: SheetRowUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_ROW,
    rowId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Rows
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROWS = 'UPDATE_SHEET_ROWS'
interface UpdateSheetRows {
  type: typeof UPDATE_SHEET_ROWS,
  nextRows: SheetRows
}

export const updateSheetRows = (nextRows: SheetRows): SheetActions => {
	return {
		type: UPDATE_SHEET_ROWS,
    nextSheetRows,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORT = 'UPDATE_SHEET_SORT'
interface UpdateSheetSort {
	type: typeof UPDATE_SHEET_SORT
  sortId: string
	updates: SheetSortUpdates
}

export const updateSheetSort = (sortId: string, updates: SheetSortUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetSortReducer(sortId, updates))
		mutation.updateSheetSort(sortId, updates)
	}
}

export const updateSheetSortReducer = (sortId: string, updates: SheetSortUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_SORT,
    sortId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sorts
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORTS = 'UPDATE_SHEET_SORTS'
interface UpdateSheetSorts {
  type: typeof UPDATE_SHEET_SORTS,
  nextSorts: SheetSorts
}

export const updateSheetSorts = (nextSorts: SheetSorts): SheetActions => {
	return {
		type: UPDATE_SHEET_SORTS,
    nextSheetSorts,
	}
}