//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { groupBy, orderBy } from 'lodash'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { mutation } from '@app/api'

import { AppState } from '@app/state'
import { 
  Sheet, SheetFromServer, SheetUpdates,
  SheetColumns, 
  SheetRows, 
  SheetCell, SheetCellUpdates,
  SheetFilter, SheetFilters, SheetFilterType,
  SheetGroup, SheetGroupUpdates, SheetGroups, 
  SheetSort, SheetSortUpdates, SheetSorts, SheetRow, 
} from '@app/state/sheet/types'
import { FileType } from '@app/state/folder/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

import { updateFiles, updateFolders } from '@app/state/folder/actions'
import { updateTabs } from '@app/state/tab/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type SheetActions = 
  CreateFilter | DeleteFilter |
  CreateSheetGroup | DeleteSheetGroup |
  CreateSheetRow | 
  CreateSort | DeleteSort | 
  LoadSheet | UpdateSheet | UpdateSheetCell

//-----------------------------------------------------------------------------
// Defaults
//-----------------------------------------------------------------------------
const defaultRow = (sheetId: string, rowId: string, columns: SheetColumns): SheetRow => {
  return {
    id: rowId,
    sheetId: sheetId,
    cells: Object.keys(columns).map(columnId => defaultCell(sheetId, rowId, columnId))
  }
}

const defaultCell = (sheetId: string, rowId: string, columnId: string): SheetCell => {
  return {
    id: createUuid(),
    sheetId: sheetId, 
    columnId: columnId,
    rowId: rowId,
    value: ""
  }
}
//-----------------------------------------------------------------------------
// Resolvers
//-----------------------------------------------------------------------------
const resolveValue = (value: string) => {
  const filteredValue = value !== null ? value.replace('%', '') : ""
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

const resolveVisibleRows = (rows: SheetRows, filters?: SheetFilters, groups?: SheetGroups, sorts?: SheetSorts) => {
  console.log('resolveVisibleRows')
  const rowIds: string[] = Object.keys(rows)

  // Filter
  const filteredRowIds: string[] = !filters ? rowIds : rowIds.map(rowId => {
    const row = rows[rowId]
    let passesFilter = true
    filters.forEach(filter => {
      const cellValue = row.cells.find(cell => cell.columnId === filter.columnId).value
      if(!resolveFilter(cellValue, filter.value, filter.type)) { passesFilter = false }
    })
    return passesFilter ? rowId : undefined
  }).filter(Boolean)

  // Sort
  const sortBy = sorts && sorts.map(sort => {
    return (rowId: string) => {
      const value = rows[rowId].cells.find(cell => cell.columnId === sort.columnId).value
      return resolveValue(value)
    }
  })
  const sortOrder = sorts && sorts.map(sort => sort.order === 'ASC' ? 'asc' : 'desc')
  const filteredSortedRowIds = orderBy(filteredRowIds, sortBy, sortOrder)
  
  // Group
  if(groups.length === 0) {
    return filteredSortedRowIds
  }
  else {
    const groupedRowIds = groupBy(filteredSortedRowIds, (rowId: string) => {
      const getValue = (group: SheetGroup) => {
        const cell = rows[rowId] && rows[rowId].cells.find(cell => cell.columnId === group.columnId)
        return cell && cell.value
      }
      return groups.map(group => getValue(group)).reduce((combined: string, current: string) => combined + current.toLowerCase() + '-')
    })
    const filteredSortedGroupedRowIds: string[] = []
    const orderedGroups = groups[0].order === 'ASC' ? Object.keys(groupedRowIds).sort() : Object.keys(groupedRowIds).sort().reverse()
    orderedGroups.forEach(groupName => {
      const group = groupedRowIds[groupName]
      filteredSortedGroupedRowIds.push('GROUP_HEADER')
      filteredSortedGroupedRowIds.push(...group)
    })
    return filteredSortedGroupedRowIds
  }
}

const resolveVisibleColumns = (columns: SheetColumns) => {
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
      fileType,
      filters
    } = getState().sheet[sheetId]
    const nextFilters = [...filters, newFilter]
    dispatch(updateSheetReducer(sheetId, {
      filters: nextFilters
    }))
    // Save to Server
    const newFilterSheetId = fileType === 'SHEET' ? sheetId : null
    const newFilterSheetViewId = fileType === 'SHEET_VIEW' ? sheetId : null
    mutation.createSheetFilter({ 
      ...newFilter,
      sheetId: newFilterSheetId,
      sheetViewId: newFilterSheetViewId })
    // Update Visible Rows
    clearTimeout(createFilterUpdateVisibleRowsTimeout)
    createFilterUpdateVisibleRowsTimeout = setTimeout(() => {
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
// Update Filter
//-----------------------------------------------------------------------------
export interface SheetFilterUpdates {}

export const updateFilter = (sheetId: string, filterId: string, updates: SheetFilterUpdates): ThunkAction => {
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
// Create Group
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
// Delete Group
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
// Update Group
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
// Create Sort
//-----------------------------------------------------------------------------
export const CREATE_SORT = 'CREATE_SORT'
interface CreateSort {
	type: typeof CREATE_SORT
}

export const createSort = (sheetId: string, newSort: SheetSort): ThunkAction => {
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
// Delete Sort
//-----------------------------------------------------------------------------
export const DELETE_SORT = 'DELETE_SORT'
interface DeleteSort {
	type: typeof DELETE_SORT
}

export const deleteSort = (sheetId: string, columnId: string): ThunkAction => {
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
// Update Sort
//-----------------------------------------------------------------------------
export const updateSort = (sheetId: string, sortId: string, updates: SheetSortUpdates): ThunkAction => {
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
		mutation.updateSheetCell(cellId, updates).then(() => {
			dispatch(updateSheetCellReducer(sheetId, rowId, cellId, updates))
		})
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
    const newSheetViewFilters = sourceSheet.filters.map(filter => ({ ...filter, id: createUuid(), sheetViewId: newSheetViewId, sheetId: null }))
    const newSheetViewGroups = sourceSheet.groups.map(group => ({ ...group, id: createUuid(), sheetViewId: newSheetViewId, sheetId: null }))
    const newSheetViewSorts = sourceSheet.sorts.map(sort => ({ ...sort, id: createUuid(), sheetViewId: newSheetViewId, sheetId: null }))
    // Update sheets
    dispatch(loadSheetReducer({
      ...sourceSheet,
      id: newSheetViewId,
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
      sheetId: sheetId,
      filters: newSheetViewFilters,
      groups: newSheetViewGroups,
      sorts: newSheetViewSorts
    })
	}
}


//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const CREATE_SHEET_ROW = 'CREATE_SHEET_ROW'
interface CreateSheetRow {
	type: typeof CREATE_SHEET_ROW
}

export const createSheetRow = (sheetId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      columns,
      rows,
      visibleRows
    } = getState().sheet[sheetId]
    const newRow = defaultRow(sheetId, createUuid(), columns)
    console.log(newRow)
    const nextRows = { ...rows, [newRow.id]: newRow }
    const nextVisibleRows = [ newRow.id, ...visibleRows]
    dispatch(updateSheetReducer(sheetId, {
      rows: nextRows,
      visibleRows: nextVisibleRows
    }))
    mutation.createSheetRow(newRow)
	}
}
