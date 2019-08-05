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
  UpdateSheetColumn |
  CreateSheetFilter | DeleteSheetFilter |
  CreateSheetGroup | DeleteSheetGroup |
  CreateSheetRow | 
  CreateSheetSort | DeleteSheetSort | 
  LoadSheet | UpdateSheet | UpdateSheetCell

//-----------------------------------------------------------------------------
// Create Sheet Filter
//-----------------------------------------------------------------------------
export const CREATE_SHEET_FILTER = 'CREATE_SHEET_FILTER'
interface CreateSheetFilter {
  type: typeof CREATE_SHEET_FILTER
}

let createSheetFilterUpdateVisibleRowsTimeout: number = null
export const createSheetFilter = (sheetId: string, newFilter: SheetFilter): ThunkAction => {
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
    mutation.createSheetFilter({ 
      ...newFilter,
      sheetId: sheetId })
    // Update Visible Rows
    clearTimeout(createSheetFilterUpdateVisibleRowsTimeout)
    createSheetFilterUpdateVisibleRowsTimeout = setTimeout(() => {
      const {
        filters,
        groups,
        rows,
        sorts
      } = getState().sheet[sheetId]
      const nextVisibleRows = resolveVisibleRows(rows, filters, groups, sorts)
      dispatch(updateSheetReducer(sheetId, {
        visibleRows: nextVisibleRows
      }))
    }, 50)
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Group
//-----------------------------------------------------------------------------
export const CREATE_SHEET_GROUP = 'CREATE_SHEET_GROUP'
interface CreateSheetGroup {
	type: typeof CREATE_SHEET_GROUP
}

export const createSheetGroup = (sheetId: string, newSheetGroup: SheetGroup): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet[sheetId]
    const nextGroups = [...groups, newSheetGroup]
    const nextVisibleRows = resolveVisibleRows(rows, filters, nextGroups, sorts)
    dispatch(updateSheetReducer(sheetId, {
      groups: nextGroups,
      visibleRows: nextVisibleRows
    }))
    mutation.createSheetGroup({ sheetId: sheetId, ...newSheetGroup })
	}
}

//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const CREATE_SHEET_ROW = 'CREATE_SHEET_ROW'
interface CreateSheetRow {
	type: typeof CREATE_SHEET_ROW
}

export const createSheetRow = (sheetId: string, sourceSheetId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      columns,
      rows,
      visibleRows
    } = getState().sheet[sheetId]
    const newRow = defaultRow(sourceSheetId !== null ? sourceSheetId : sheetId, createUuid(), columns)
    const nextRows = { ...rows, [newRow.id]: newRow }
    const nextVisibleRows = [ newRow.id, ...visibleRows]
    dispatch(updateSheetReducer(sheetId, {
      rows: nextRows,
      visibleRows: nextVisibleRows
    }))
    mutation.createSheetRow(newRow)
	}
}

//-----------------------------------------------------------------------------
// Create Sheet Sort
//-----------------------------------------------------------------------------
export const CREATE_SHEET_SORT = 'CREATE_SHEET_SORT'
interface CreateSheetSort {
	type: typeof CREATE_SHEET_SORT
}

export const createSheetSort = (sheetId: string, newSort: SheetSort): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet[sheetId]
    const nextSorts = [...sorts, newSort]
    const nextVisibleRows = resolveVisibleRows(rows, filters, groups, nextSorts)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
    mutation.createSheetSort({ sheetId: sheetId, ...newSort })
	}
}


//-----------------------------------------------------------------------------
// Create Sheet View
//-----------------------------------------------------------------------------
export const createSheetView = (sheetId: string, viewName: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      folder: { activeFolderPath, files, folders },
      sheet,
      tab: { tabs }
    } = getState()
    const sourceSheet = sheet[sheetId]
    const fileId = Object.keys(files).find(fileId => files[fileId].typeId === sheetId)
    const folderId = activeFolderPath[activeFolderPath.length - 1]
    const newFileId = createUuid()
    const newSheetViewId = createUuid()
    const newSheetViewFilters = sourceSheet.filters.map(filter => ({ ...filter, id: createUuid(), sheetId: newSheetViewId }))
    const newSheetViewGroups = sourceSheet.groups.map(group => ({ ...group, id: createUuid(), sheetId: newSheetViewId }))
    const newSheetViewSorts = sourceSheet.sorts.map(sort => ({ ...sort, id: createUuid(), sheetId: newSheetViewId }))
    // Update sheets
    dispatch(loadSheetReducer({
      ...sourceSheet,
      id: newSheetViewId,
      sourceSheetId: sourceSheet.id,
      filters: newSheetViewFilters,
      groups: newSheetViewGroups,
      sorts: newSheetViewSorts
    }))
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
      filters,
      groups,
      rows,
      sorts
    } = getState().sheet[sheetId]
    const nextFilters = filters.filter(filter => filter.id !== filterId)
    const nextVisibleRows = resolveVisibleRows(rows, nextFilters, groups, sorts)
    dispatch(updateSheetReducer(sheetId, {
      filters: nextFilters,
      visibleRows: nextVisibleRows
    }))
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
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet[sheetId]
    const groupToDelete = groups.find(group => group.columnId === columnId)
    const nextGroups = groups.filter(group => group.id !== groupToDelete.id)
    const nextVisibleRows = resolveVisibleRows(rows, filters, nextGroups, sorts)
    dispatch(updateSheetReducer(sheetId, {
      groups: nextGroups,
      visibleRows: nextVisibleRows
    }))
    mutation.deleteSheetGroup(groupToDelete.id)
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
    } = getState().sheet[sheetId]
    const sortToDelete = sorts.find(sort => sort.columnId === columnId)
    const nextSorts = sorts.filter(sort => sort.id !== sortToDelete.id)
    const nextVisibleRows = resolveVisibleRows(rows, filters, groups, nextSorts)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
    mutation.deleteSheetSort(sortToDelete.id)
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
    const normalizedRows: SheetRows = {}
    const normalizedColumns: SheetColumns = {}
    sheet.rows.forEach(row => { normalizedRows[row.id] = row })
    sheet.columns.forEach(column => { normalizedColumns[column.id] = column })
		dispatch(
			loadSheetReducer({
        id: sheet.id,
        sourceSheetId: sheet.sourceSheetId,
        fileType: sheet.fileType,
        columns: normalizedColumns,
        visibleColumns: resolveVisibleColumns(normalizedColumns),
        rows: normalizedRows,
        visibleRows: resolveVisibleRows(normalizedRows, sheet.filters, sheet.groups, sheet.sorts),
        groups: sheet.groups,
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
  rowId: string
	cellId: string
	updates: SheetCellUpdates
}

export const updateSheetCell = (sheetId: string, rowId: string, cellId: string, updates: SheetCellUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    batchSheetCellUpdate(() => dispatch(updateSheetCellReducer(sheetId, rowId, cellId, updates)))
		mutation.updateSheetCell(cellId, updates)
	}
}

export const updateSheetCellReducer = (sheetId: string, rowId: string, cellId: string, updates: SheetCellUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		sheetId,
    rowId,
		cellId,
		updates,
	}
}

let batchedSheetCellUpdatesTimeout: number = null
let batchedSheetCellUpdates: Array<() => SheetActions> = []
const batchSheetCellUpdate = (sheetCellUpdate: () => SheetActions) => {
  clearTimeout(batchedSheetCellUpdatesTimeout)
  batchedSheetCellUpdates.push(sheetCellUpdate)
  batchedSheetCellUpdatesTimeout = setTimeout(() => runBatchedSheetCellUpdates(), 500)
}
const runBatchedSheetCellUpdates = () => {
  console.log('runBatchedUpdates')
  batch(() => {
    batchedSheetCellUpdates.forEach(sheetCellUpdate => sheetCellUpdate())
  })
}
export const clearTimeoutBatchedSheetCellUpdates = () => {
  console.log('clearTimeout')
  clearTimeout(batchedSheetCellUpdatesTimeout)
}

//-----------------------------------------------------------------------------
// Update Sheet Column
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMN = 'UPDATE_SHEET_COLUMN'
interface UpdateSheetColumn {
	type: typeof UPDATE_SHEET_COLUMN
	sheetId: string
  columnId: string
	updates: SheetColumnUpdates
}

export const updateSheetColumn = (sheetId: string, columnId: string, updates: SheetColumnUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch) => {
    dispatch(updateSheetColumnReducer(sheetId, columnId, updates))
		mutation.updateSheetColumn(columnId, updates)
	}
}

export const updateSheetColumnReducer = (sheetId: string, columnId: string, updates: SheetColumnUpdates): SheetActions => {
	return {
		type: UPDATE_SHEET_COLUMN,
		sheetId,
    columnId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filter
//-----------------------------------------------------------------------------
export interface SheetFilterUpdates {}

export const updateSheetFilter = (sheetId: string, filterId: string, updates: SheetFilterUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet[sheetId]
    const filterIndex = filters.findIndex(filter => filter.id === filterId)
    const nextFilters = clone(filters)
    if(filterIndex > -1) {
      nextFilters[filterIndex] = { ...nextFilters[filterIndex], ...updates }
    }
    const nextVisibleRows = resolveVisibleRows(rows, nextFilters, groups, sorts)
    dispatch(updateSheetReducer(sheetId, {
      filters: nextFilters,
      visibleRows: nextVisibleRows
    }))
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Group
//-----------------------------------------------------------------------------
export const updateSheetGroup = (sheetId: string, groupId: string, updates: SheetGroupUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet[sheetId]
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const nextGroups = clone(groups)
    if(groupIndex > -1) {
      nextGroups[groupIndex] = { ...nextGroups[groupIndex], ...updates }
    }
    const nextVisibleRows = resolveVisibleRows(rows, filters, nextGroups, sorts)
    dispatch(updateSheetReducer(sheetId, {
      groups: nextGroups,
      visibleRows: nextVisibleRows
    }))
    mutation.updateSheetGroup(groupId, updates)
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sort
//-----------------------------------------------------------------------------
export const updateSheetSort = (sheetId: string, sortId: string, updates: SheetSortUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      filters,
      groups,
      rows,
      sorts,
    } = getState().sheet[sheetId]
    const sortIndex = sorts.findIndex(sort => sort.id === sortId)
    const nextSorts = clone(sorts)
    if(sortIndex > -1) {
      nextSorts[sortIndex] = { ...nextSorts[sortIndex], ...updates }
    }
    const nextVisibleRows = resolveVisibleRows(rows, filters, groups, nextSorts)
    dispatch(updateSheetReducer(sheetId, {
      sorts: nextSorts,
      visibleRows: nextVisibleRows
    }))
    mutation.updateSheetSort(sortId, updates)
	}
}