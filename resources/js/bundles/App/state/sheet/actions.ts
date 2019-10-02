//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { 
  ISheet, ISheetFromServer, ISheetUpdates,
  ISheetActiveUpdates, 
  IAllSheetColumns, ISheetColumn, ISheetColumnUpdates,
  IAllSheetRows, ISheetRow, ISheetRowUpdates, 
  IAllSheetCells, ISheetCell, ISheetCellUpdates,
  ISheetClipboard,
  IAllSheetFilters, ISheetFilter, ISheetFilterUpdates,
  IAllSheetGroups, ISheetGroup, ISheetGroupUpdates,
  IAllSheetSorts, ISheetSort, ISheetSortUpdates,
  ISheetStylesUpdates, ISheetStylesServerUpdates,
} from '@app/state/sheet/types'
import { 
  IFile, IFileType, 
  IFolder 
} from '@app/state/folder/types'
import { IThunkAction, IThunkDispatch } from '@app/state/types'

import { createFile, updateFile, updateFiles, updateFolders } from '@app/state/folder/actions'
import { createHistoryStep } from '@app/state/history/actions'
import { updateTabs } from '@app/state/tab/actions'

import { resolveSheetRowLeaders, resolveSheetVisibleRows } from '@app/state/sheet/resolvers'

import { defaultCell, defaultColumn, defaultRow, defaultSheetSelections, defaultSheetStyles } from '@app/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type ISheetActions = 
  ILoadSheet | IUpdateSheet | 
  IUpdateSheetActive |
  IUpdateSheetCell | ISetAllSheetCells | 
  IUpdateSheetClipboard |
  IUpdateSheetColumn | ISetAllSheetColumns | 
  IDeleteSheetFilter | IUpdateSheetFilter | ISetAllSheetFilters |
  IDeleteSheetGroup | IUpdateSheetGroup | ISetAllSheetGroups |
  IUpdateSheetRow | ISetAllSheetRows | 
  IDeleteSheetSort | IUpdateSheetSort | ISetAllSheetSorts

//-----------------------------------------------------------------------------
// Copy Sheet Range
//-----------------------------------------------------------------------------
export const copySheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          selections: {
            rangeCellIds,
            rangeStartColumnId,
            rangeStartRowId,
            rangeStartCellId,
            rangeEndColumnId,
            rangeEndRowId,
            rangeEndCellId,
          },
          visibleColumns,
          visibleRows
        }
      }
    } = getState().sheet
    dispatch(updateSheetClipboard({
      sheetId: sheetId,
      cutOrCopy: 'COPY',
      selections: {
          rangeCellIds,
          rangeStartColumnId,
          rangeStartRowId,
          rangeStartCellId,
          rangeEndColumnId,
          rangeEndRowId,
          rangeEndCellId,
          visibleColumns,
          visibleRows
      }
    }))
  }
}

//-----------------------------------------------------------------------------
// Cut Sheet Range
//-----------------------------------------------------------------------------
export const cutSheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: {
          selections: {
            rangeCellIds,
            rangeStartColumnId,
            rangeStartRowId,
            rangeStartCellId,
            rangeEndColumnId,
            rangeEndRowId,
            rangeEndCellId,
          },
          visibleColumns,
          visibleRows
        }
      }
    } = getState().sheet
    dispatch(updateSheetClipboard({
      sheetId: sheetId,
      cutOrCopy: 'CUT',
      selections: {
          rangeCellIds,
          rangeStartColumnId,
          rangeStartRowId,
          rangeStartCellId,
          rangeEndColumnId,
          rangeEndRowId,
          rangeEndCellId,
          visibleColumns,
          visibleRows
      }
    }))
  }
}

//-----------------------------------------------------------------------------
// Paste Sheet Range
//-----------------------------------------------------------------------------
export const pasteSheetRange = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      clipboard,
      allSheetRows,
      allSheets: {
        [sheetId]: sheet
      }
    } = getState().sheet
    const {
      selections: {
        rangeEndColumnId: clipboardRangeEndColumnId,
        rangeEndRowId: clipboardRangeEndRowId,
        rangeStartColumnId: clipboardRangeStartColumnId,
        rangeStartRowId: clipboardRangeStartRowId,
        visibleColumns: allClipboardVisibleColumns,
        visibleRows: allClipboardVisibleRows
      }
    } = clipboard
    const {
      selections: {
        rangeStartColumnId: sheetRangeStartColumnId,
        rangeStartRowId: sheetRangeStartRowId,
      },
      visibleColumns: allSheetVisibleColumns,
      visibleRows: allSheetVisibleRows
    } = sheet
    const nextAllSheetCells = clone(allSheetCells)
    const sheetCellUpdates: ISheetCellUpdates[] = []

    const clipboardVisibleColumns = allClipboardVisibleColumns.filter(columnId => columnId !== 'COLUMN_BREAK')
    const clipboardVisibleRows = allClipboardVisibleRows.filter(rowId => rowId !== 'ROW_BREAK')
    const sheetVisibleColumns = allSheetVisibleColumns.filter(columnId => columnId !== 'COLUMN_BREAK')
    const sheetVisibleRows = allSheetVisibleRows.filter(rowId => rowId !== 'COLUMN_BREAK')

    const clipboardRangeStartColumnIndex = clipboardVisibleColumns.indexOf(clipboardRangeStartColumnId)
    const sheetRangeStartColumnIndex = sheetVisibleColumns.indexOf(sheetRangeStartColumnId)
    const clipboardRangeStartRowIndex = clipboardVisibleRows.indexOf(clipboardRangeStartRowId)
    const sheetRangeStartRowIndex = sheetVisibleRows.indexOf(sheetRangeStartRowId)

    for(let clipboardRowIndex = clipboardVisibleRows.indexOf(clipboardRangeStartRowId); clipboardRowIndex <= clipboardVisibleRows.indexOf(clipboardRangeEndRowId); clipboardRowIndex++) {
      const clipboardRowId = clipboardVisibleRows[clipboardRowIndex]
      const sheetRowId = sheetVisibleRows[sheetRangeStartRowIndex + (clipboardRowIndex - clipboardRangeStartRowIndex)]
      const clipboardRow = allSheetRows[clipboardRowId]
      const sheetRow = allSheetRows[sheetRowId]

      if(clipboardRow && sheetRow) {
        for(let clipboardColumnIndex = clipboardVisibleColumns.indexOf(clipboardRangeStartColumnId); clipboardColumnIndex <= clipboardVisibleColumns.indexOf(clipboardRangeEndColumnId); clipboardColumnIndex++) {
          const clipboardColumnId = clipboardVisibleColumns[clipboardColumnIndex]
          const sheetColumnId = sheetVisibleColumns[sheetRangeStartColumnIndex + (clipboardColumnIndex - clipboardRangeStartColumnIndex)]
          const clipboardCellId = clipboardRow.cells[clipboardColumnId]
          const sheetCellId = sheetRow.cells[sheetColumnId]
          const clipboardCell = allSheetCells[clipboardCellId]
          if(clipboardCell && sheetCellId) {
            nextAllSheetCells[sheetCellId].value = clipboardCell.value
            sheetCellUpdates.push({ id: sheetCellId, value: clipboardCell.value })
          }
        }
      }
    }
    dispatch(setAllSheetCells(nextAllSheetCells))
    mutation.updateSheetCells(sheetCellUpdates)
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
// Create Sheet
//-----------------------------------------------------------------------------
export const createSheet = (folderId: IFolder['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch) => {
    const newSheetId = createUuid()
    const newFile: IFile = {
      id: createUuid(),
      folderId: folderId,
      name: null,
      type: 'SHEET',
      typeId: newSheetId,
      isPreventedFromSelecting: true
    }
    dispatch(createFile(folderId, newFile))
    mutation.createSheet(newSheetId).then(() => {
      dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    })
  }
}

//-----------------------------------------------------------------------------
// Create Sheet From Csv
//-----------------------------------------------------------------------------
export const createSheetFromCsv = (folderId: IFolder['id'], fileToUpload: File): IThunkAction => {
  return async (dispatch: IThunkDispatch) => {
    const newSheetId = createUuid()
    const newFile: IFile = {
      id: createUuid(),
      folderId: folderId,
      name: fileToUpload.name.split('.').slice(0, -1).join(''), // fileToUpload name without the extension
      type: 'SHEET',
      typeId: newSheetId,
      isPreventedFromSelecting: true
    }
    dispatch(createFile(folderId, newFile))
    mutation.createSheetFromCsv(newSheetId, fileToUpload).then(() => {
      dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    })
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Column
//-----------------------------------------------------------------------------
export const createSheetColumn = (sheetId: ISheet['id'], newColumnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetColumns,
      allSheetRows,
      allSheetCells,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const sheetVisibleColumns = sheet.visibleColumns.length === 0 ? clone(sheet.columns) : clone(sheet.visibleColumns)
    // Create sheet column
    const newColumn = defaultColumn(sheetId, newColumnVisibleColumnsIndex)
    // Update the sheet's visible columns
    const nextSheetVisibleColumns = [
      ...sheetVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      newColumn.id,
      ...sheetVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]
    // For each row, add a cell 
    let nextAllSheetCells: IAllSheetCells = clone(allSheetCells)
    let nextAllSheetRows: IAllSheetRows = clone(allSheetRows)
    let newCells: ISheetCell[] = []
    sheet.rows.forEach(rowId => {
      const newCell = defaultCell(sheetId, rowId, newColumn.id, createUuid())
      nextAllSheetCells[newCell.id] = newCell
      nextAllSheetRows[rowId].cells = { ...nextAllSheetRows[rowId].cells, [newCell.columnId]: newCell.id }
      newCells.push(newCell)
    })
    // Make the updates
    batch(() => {
      dispatch(setAllSheetColumns({
        ...allSheetColumns,
        [newColumn.id]: newColumn
      }))
      dispatch(updateSheet(sheetId, {
        visibleColumns: nextSheetVisibleColumns
      }))
      dispatch(setAllSheetCells(nextAllSheetCells))
      dispatch(setAllSheetRows(nextAllSheetRows))
    })
    // Save to server
    mutation.createSheetColumn(newColumn, newCells)
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Column Break
//-----------------------------------------------------------------------------
export const createSheetColumnBreak = (sheetId: ISheet['id'], newColumnVisibleColumnsIndex: number): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const sheetVisibleColumns = sheet.visibleColumns.length === 0 ? clone(sheet.columns) : clone(sheet.visibleColumns)
    // Update the sheet's visible columns
    const nextSheetVisibleColumns = [
      ...sheetVisibleColumns.slice(0, newColumnVisibleColumnsIndex),
      'COLUMN_BREAK',
      ...sheetVisibleColumns.slice(newColumnVisibleColumnsIndex)
    ]
    // Make the updates
    const sheetUpdates = { visibleColumns: nextSheetVisibleColumns }
    batch(() => {
      dispatch(updateSheet(sheetId, sheetUpdates))
    })
    // Save to server
    mutation.updateSheet(sheetId, sheetUpdates)
  }
}


//-----------------------------------------------------------------------------
// Create Sheet Filter
//-----------------------------------------------------------------------------
export const createSheetFilter = (sheetId: string, newFilter: ISheetFilter): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetRows,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetSorts
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const nextFilters = { ...allSheetFilters, [newFilter.id]: newFilter }
    const nextSheetFilters = [ ...sheet.filters, newFilter.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, filters: nextSheetFilters }, allSheetRows, allSheetCells, nextFilters, allSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetFilters({ ...allSheetFilters, [newFilter.id]: newFilter }))
      dispatch(updateSheetReducer(sheetId, {
        filters: nextSheetFilters,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetFilter(newFilter)
  }
}

//-----------------------------------------------------------------------------
// Create Sheet Group
//-----------------------------------------------------------------------------
export const createSheetGroup = (sheetId: string, newGroup: ISheetGroup): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const nextAllSheetGroups = { ...allSheetGroups, [newGroup.id]: newGroup }
    const nextSheetGroups = [ ...sheet.groups, newGroup.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, groups: nextSheetGroups }, allSheetRows, allSheetCells, allSheetFilters, nextAllSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetGroups({ ...allSheetGroups, [newGroup.id]: newGroup }))
      dispatch(updateSheetReducer(sheetId, {
        groups: nextSheetGroups,
        rowLeaders: nextSheetRowLeaders,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetGroup(newGroup)
	}
}
//-----------------------------------------------------------------------------
// Create Sheet Row
//-----------------------------------------------------------------------------
export const createSheetRow = (sheetId: string, sourceSheetId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetRows,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const newRow = defaultRow(sourceSheetId !== null ? sourceSheetId : sheetId, createUuid(), sheet.columns)
    const nextAllSheetCells = { ...allSheetCells }
    Object.keys(newRow.cells).forEach((columnId: string, index: number) => {
      const cellId = newRow.cells[columnId]
      nextAllSheetCells[cellId] = defaultCell(sheetId, newRow.id, sheet.columns[index], cellId)
    })
    const nextAllSheetRows = { ...allSheetRows, [newRow.id]: newRow }
    const nextSheetRows = [ ...sheet.rows, newRow.id ]
    const nextSheetVisibleRows = [ newRow.id, ...sheet.visibleRows ]
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(setAllSheetRows(nextAllSheetRows))
      dispatch(setAllSheetCells(nextAllSheetCells))
      dispatch(updateSheetReducer(sheetId, {
        rowLeaders: nextSheetRowLeaders,
        rows: nextSheetRows,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.createSheetRow({
      ...newRow,
      cells: Object.keys(newRow.cells).map(columnId => nextAllSheetCells[newRow.cells[columnId]])
    })
	}
}

//-----------------------------------------------------------------------------
// Create Sheet Sort
//-----------------------------------------------------------------------------
export const createSheetSort = (sheetId: string, newSort: ISheetSort): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const nextAllSheetSorts = { ...allSheetSorts, [newSort.id]: newSort }
    const nextSheetSorts = [ ...sheet.sorts, newSort.id ]
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, sorts: nextSheetSorts }, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, nextAllSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(updateSheetReducer(sheetId, {
        rowLeaders: nextSheetRowLeaders,
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
export const createSheetView = (sheetId: string, viewName: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: { 
        activeFolderPath, 
        files, 
        folders 
      },
      sheet: { 
        allSheets, 
        allSheetFilters, 
        allSheetGroups, 
        allSheetSorts 
      },
      tab: { 
        tabs 
      }
    } = getState()
    const sourceSheet = allSheets[sheetId]
    const fileId = Object.keys(files).find(fileId => files[fileId].typeId === sheetId)
    const folderId = activeFolderPath[activeFolderPath.length - 1]
    const newFileId = createUuid()
    const newSheetViewId = createUuid()
    // Filters
    const newFilters: IAllSheetFilters = {}
    const newSheetViewFilters: ISheetFilter['id'][] = []
    sourceSheet.filters.forEach(filterId => {
      const newFilterId = createUuid()
      newFilters[newFilterId] = { ...allSheetFilters[filterId], id: newFilterId, sheetId: newSheetViewId, isLocked: true }
    })
    // Groups
    const newGroups: IAllSheetGroups = {}
    const newSheetViewGroups: ISheetGroup['id'][] = []
    sourceSheet.groups.forEach(groupId => {
      const newGroupId = createUuid()
      newGroups[newGroupId] = { ...allSheetGroups[groupId], id: newGroupId, sheetId: newSheetViewId, isLocked: true }
    })
    // Sorts
    const newSorts: IAllSheetSorts = {}
    const newSheetViewSorts: ISheetSort['id'][] = []
    sourceSheet.sorts.forEach(sortId => {
      const newSortId = createUuid()
      newSorts[newSortId] = { ...allSheetSorts[sortId], id: newSortId, sheetId: newSheetViewId, isLocked: true }
    })
  // Update allSheets
    dispatch(loadSheetReducer(
      {
        id: newSheetViewId,
        sourceSheetId: sourceSheet.id,
        fileType: sourceSheet.fileType,
        columns: clone(sourceSheet.columns),
        filters: newSheetViewFilters,
        groups: newSheetViewGroups,
        rows: clone(sourceSheet.rows),
        rowLeaders: clone(sourceSheet.rowLeaders),
        sorts: newSheetViewSorts,
        visibleColumns: clone(sourceSheet.visibleColumns),
        visibleRows: clone(sourceSheet.visibleRows),
        selections: defaultSheetSelections,
        styles: defaultSheetStyles
      },
      null, // Cells
      null, // Columns
      newFilters, // Filters
      newGroups, // Groups
      null, // Rows
      newSorts, // Sorts
    ))
    // Update folders and files
    const newFile = {
      ...files[fileId],
      id: newFileId,
      folderId: folderId,
      type: 'SHEET_VIEW' as IFileType, 
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
      visibleColumns: sourceSheet.visibleColumns,
      filters: newFilters,
      groups: newGroups,
      sorts: newSorts
    })
	}
}

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
    } = getState().sheet
    const sheet = allSheets[sheetId]
    // Columns
    const { [columnId]: deletedColumn, ...nextAllSheetColumns } = allSheetColumns
    // Rows
    const nextAllSheetRows: IAllSheetRows = clone(allSheetRows)
    sheet.rows.forEach(rowId => {
      const { [columnId]: deletedCell, ...nextSheetCells } = nextAllSheetRows[rowId].cells
      nextAllSheetRows[rowId].cells = nextSheetCells
    })
    // Cells
    const nextAllSheetCells: IAllSheetCells = {}
    Object.keys(allSheetCells).forEach(cellId => {
      const cell = allSheetCells[cellId]
      if(cell.columnId !== columnId) { nextAllSheetCells[cellId] = cell }
    })
    // Sheet Columns
    const nextSheetColumns = sheet.columns.filter(sheetColumnId => sheetColumnId !== columnId)
    const nextSheetVisibleColumns = sheet.visibleColumns.filter(sheetColumnId => sheetColumnId !== columnId)
    const actions = () => {
      batch(() => {
        dispatch(setAllSheetCells(nextAllSheetCells))
        dispatch(setAllSheetColumns(nextAllSheetColumns))
        dispatch(setAllSheetRows(nextAllSheetRows))
        dispatch(updateSheetReducer(sheetId, {
          columns: nextSheetColumns,
          visibleColumns: nextSheetVisibleColumns
        }))
      })
      mutation.deleteSheetColumn(columnId)
      mutation.updateSheet(sheetId, { visibleColumns: nextSheetVisibleColumns })
    }
    actions()
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Column Break
//-----------------------------------------------------------------------------
export const deleteSheetColumnBreak = (sheetId: string, columnBreakIndex: number): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets
    } = getState().sheet
    const sheet = allSheets[sheetId]
    // Sheet Columns
    const nextSheetVisibleColumns = sheet.visibleColumns.filter((_, index) => index !== columnBreakIndex)
    const actions = () => {
      batch(() => {
        dispatch(updateSheetReducer(sheetId, {
          visibleColumns: nextSheetVisibleColumns
        }))
      })
      mutation.updateSheet(sheetId, { visibleColumns: nextSheetVisibleColumns })
    }
    actions()
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Filter
//-----------------------------------------------------------------------------
export const DELETE_SHEET_FILTER = 'DELETE_SHEET_FILTER'
interface IDeleteSheetFilter {
	type: typeof DELETE_SHEET_FILTER
}

export const deleteSheetFilter = (sheetId: string, filterId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const { [filterId]: deletedFilter, ...nextFilters } = allSheetFilters
    const nextSheetFilters = sheet.filters.filter(sheetFilterId => sheetFilterId !== filterId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, filters: nextSheetFilters}, allSheetRows, allSheetCells, nextFilters, allSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetFilters(nextFilters))
      dispatch(updateSheetReducer(sheetId, {
        filters: nextSheetFilters,
        rowLeaders: nextSheetRowLeaders,
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
interface IDeleteSheetGroup {
	type: typeof DELETE_SHEET_GROUP
}

export const deleteSheetGroup = (sheetId: string, groupId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const { [groupId]: deletedGroup, ...nextAllSheetGroups } = allSheetGroups
    const nextSheetGroups = sheet.groups.filter(sheetGroupId => sheetGroupId !== groupId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, groups: nextSheetGroups}, allSheetRows, allSheetCells, allSheetFilters, nextAllSheetGroups, allSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetGroups(nextAllSheetGroups))
      dispatch(updateSheetReducer(sheetId, {
        groups: nextSheetGroups,
        rowLeaders: nextSheetRowLeaders,
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
interface IDeleteSheetSort {
	type: typeof DELETE_SHEET_SORT
}

export const deleteSheetSort = (sheetId: string, sortId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets,
      allSheetCells,
      allSheetFilters,
      allSheetGroups,
      allSheetRows,
      allSheetSorts,
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const { [sortId]: deletedSort, ...nextAllSheetSorts } = allSheetSorts
    const nextSheetSorts = sheet.sorts.filter(sheetSortId => sheetSortId !== sortId)
    const nextSheetVisibleRows = resolveSheetVisibleRows({ ...sheet, sorts: nextSheetSorts}, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, nextAllSheetSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    batch(() => {
      dispatch(clearSheetSelection(sheetId))
      dispatch(setAllSheetSorts(nextAllSheetSorts))
      dispatch(updateSheetReducer(sheetId, {
        rowLeaders: nextSheetRowLeaders,
        sorts: nextSheetSorts,
        visibleRows: nextSheetVisibleRows
      }))
    })
    mutation.deleteSheetSort(sortId)
	}
}

//-----------------------------------------------------------------------------
// Delete Sheet Row
//-----------------------------------------------------------------------------
export const deleteSheetRow = (sheetId: string, rowId: ISheetRow['id']): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets
    } = getState().sheet
    const sheet = allSheets[sheetId]
    const nextSheetRows = sheet.rows.filter(sheetRowId => sheetRowId !== rowId)
    const nextSheetVisibleRows = sheet.visibleRows.filter(visibleRowId => visibleRowId !== rowId)
    const actions = () => {
      batch(() => {
        dispatch(updateSheetReducer(sheetId, {
          rows: nextSheetRows,
          visibleRows: nextSheetVisibleRows
        }))
      })
      mutation.deleteSheetRow(rowId)
    }
    actions()
	}
}

//-----------------------------------------------------------------------------
// Hide Sheet Column
//-----------------------------------------------------------------------------
export const hideSheetColumn = (sheetId: ISheet['id'], columnVisibleColumnsIndex: number) => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      visibleColumns
    } = getState().sheet.allSheets[sheetId]
    const nextVisibleColumns = visibleColumns.filter((_, index) => index !== columnVisibleColumnsIndex)
    dispatch(updateSheet(sheetId, { visibleColumns: nextVisibleColumns }))
  }
}

//-----------------------------------------------------------------------------
// Load Sheet
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
}

export const loadSheet = (sheetFromServer: ISheetFromServer): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    // Rows and cells
    const normalizedRows: IAllSheetRows = {}
    const normalizedCells: IAllSheetCells = {}
    sheetFromServer.rows.forEach(row => { 
      let rowCells: { [columnId: string]: ISheetCell['id'] }  = {}
      row.cells.forEach(cell => {
        normalizedCells[cell.id] = { 
          ...cell, 
          isCellEditing: false,
          isCellSelected: false,
        }
        rowCells[cell.columnId] = cell.id
      })
      normalizedRows[row.id] = { id: row.id, sheetId: sheetFromServer.id, cells: rowCells}
    })
    // Columns
    const normalizedColumns: IAllSheetColumns = {}
    const sheetColumns: ISheetColumn['id'][] = []
    sheetFromServer.columns.forEach(column => { 
      normalizedColumns[column.id] = column 
      sheetColumns.push(column.id)
    })
    // Filters
    const normalizedFilters: IAllSheetFilters = {}
    const sheetFilters: ISheetFilter['id'][] = []
    sheetFromServer.filters.forEach((filter: ISheetFilter) => { 
      normalizedFilters[filter.id] = filter 
      sheetFilters.push(filter.id)
    })
    // Groups
    const normalizedGroups: IAllSheetGroups = {}
    const sheetGroups: ISheetGroup['id'][] = []
    sheetFromServer.groups.forEach(group => { 
      normalizedGroups[group.id] = group 
      sheetGroups.push(group.id)
    })
    // Sorts
    const normalizedSorts: IAllSheetSorts = {}
    const sheetSorts: ISheetSort['id'][] = []
    sheetFromServer.sorts.forEach(sort => { 
      normalizedSorts[sort.id] = sort 
      sheetSorts.push(sort.id)
    })
    // New Sheet
    const newSheet: ISheet = {
      id: sheetFromServer.id,
      sourceSheetId: sheetFromServer.sourceSheetId,
      fileType: sheetFromServer.fileType,
      columns: sheetColumns,
      filters: sheetFilters,
      groups: sheetGroups,
      rowLeaders: null,
      rows: sheetFromServer.rows.map(row => row.id),
      sorts: sheetSorts,
      visibleColumns: sheetFromServer.visibleColumns !== null ? sheetFromServer.visibleColumns : sheetColumns,
      visibleRows: null,
      selections: defaultSheetSelections,
      styles: {
        id: sheetFromServer.styles.id,
        backgroundColor: new Set(sheetFromServer.styles.backgroundColor) as Set<string>,
        backgroundColorReference: sheetFromServer.styles.backgroundColorReference || {},
        bold: new Set(sheetFromServer.styles.bold) as Set<string>,
        color: new Set(sheetFromServer.styles.color) as Set<string>,
        colorReference: sheetFromServer.styles.colorReference || {},
        italic: new Set(sheetFromServer.styles.italic) as Set<string>,
      }
    }

    const nextSheetVisibleRows = resolveSheetVisibleRows(newSheet, normalizedRows, normalizedCells, normalizedFilters, normalizedGroups, normalizedSorts)
    const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
    
		dispatch(
			loadSheetReducer(
        {
          ...newSheet,
          visibleRows: nextSheetVisibleRows,
          rowLeaders: nextSheetRowLeaders
        },
        normalizedCells,
        normalizedColumns,
        normalizedFilters,
        normalizedGroups,
        normalizedRows,
        normalizedSorts,
			)
		)
	}
}

export const loadSheetReducer = (sheet: ISheet, cells: IAllSheetCells, columns: IAllSheetColumns, filters: IAllSheetFilters, groups: IAllSheetGroups, rows: IAllSheetRows, sorts: IAllSheetSorts): ISheetActions => {
	return {
		type: LOAD_SHEET,
    columns,
    rows,
		sheet,
    cells,
    filters,
    groups,
    sorts,
	}
}

//-----------------------------------------------------------------------------
// Show Sheet Column
//-----------------------------------------------------------------------------
export const showSheetColumn = (sheetId: ISheet['id'], columnVisibleColumnsIndex: number, columnIdToShow: ISheetColumn['id']) => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      visibleColumns
    } = getState().sheet.allSheets[sheetId]
    // Update the sheet's visible columns
    const nextVisibleColumns = [
      ...visibleColumns.slice(0, columnVisibleColumnsIndex),
      columnIdToShow,
      ...visibleColumns.slice(columnVisibleColumnsIndex)
    ]
    dispatch(updateSheet(sheetId, { visibleColumns: nextVisibleColumns }))
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

export const updateSheet = (sheetId: string, updates: ISheetUpdates, skipServerUpdate: boolean = false): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetReducer(sheetId, updates))
    !skipServerUpdate && mutation.updateSheet(sheetId, updates)
	}
}

export const updateSheetReducer = (sheetId: string, updates: ISheetUpdates): ISheetActions => {
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

export const updateSheetCell = (cellId: string, updates: ISheetCellUpdates, undoUpdates: ISheetCellUpdates = null, skipServerUpdate: boolean = false): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    const actions = () => {
      dispatch(updateSheetCellReducer(cellId, updates))
      !skipServerUpdate && mutation.updateSheetCell(cellId, updates)
    }
    const undoActions = () => {
      dispatch(updateSheetCellReducer(cellId, undoUpdates))
      !skipServerUpdate && mutation.updateSheetCell(cellId, undoUpdates)
    }
    undoUpdates !== null && dispatch(createHistoryStep({actions, undoActions}))
    actions()
	}
}

export const updateSheetCellReducer = (cellId: string, updates: ISheetCellUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_CELL,
		cellId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Cells
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
// Update Sheet Column
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_COLUMN = 'UPDATE_SHEET_COLUMN'
interface IUpdateSheetColumn {
	type: typeof UPDATE_SHEET_COLUMN
  columnId: string
	updates: ISheetColumnUpdates
}

export const updateSheetColumn = (columnId: string, updates: ISheetColumnUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetColumnReducer(columnId, updates))
		mutation.updateSheetColumn(columnId, updates)
	}
}

export const updateSheetColumnReducer = (columnId: string, updates: ISheetColumnUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_COLUMN,
    columnId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Columns
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
// Update Sheet Filter
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_FILTER = 'UPDATE_SHEET_FILTER'
interface IUpdateSheetFilter {
	type: typeof UPDATE_SHEET_FILTER
  filterId: string
	updates: ISheetFilterUpdates
}

export const updateSheetFilter = (sheetId: ISheet['id'], filterId: string, updates: ISheetFilterUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(clearSheetSelection(sheetId))
    dispatch(updateSheetFilterReducer(filterId, updates))
		//mutation.updateSheetFilter(filterId, updates)
	}
}

export const updateSheetFilterReducer = (filterId: string, updates: ISheetFilterUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_FILTER,
    filterId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Filters
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
// Update Sheet Group
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_GROUP = 'UPDATE_SHEET_GROUP'
interface IUpdateSheetGroup {
	type: typeof UPDATE_SHEET_GROUP
  groupId: string
	updates: ISheetGroupUpdates
}

export const updateSheetGroup = (sheetId: ISheet['id'], groupId: string, updates: ISheetGroupUpdates, skipVisibleRowsUpdate?: boolean): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    dispatch(updateSheetGroupReducer(groupId, updates))
    mutation.updateSheetGroup(groupId, updates)
    if(!skipVisibleRowsUpdate) {
      setTimeout(() => {
        const {
          allSheets,
          allSheetCells,
          allSheetFilters,
          allSheetGroups,
          allSheetRows,
          allSheetSorts,
        } = getState().sheet
        const sheet = allSheets[sheetId]
        const nextSheetVisibleRows = resolveSheetVisibleRows(sheet, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, allSheetSorts)
        const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
        dispatch(clearSheetSelection(sheetId))
        dispatch(updateSheet(sheetId, {
          rowLeaders: nextSheetRowLeaders,
          visibleRows: nextSheetVisibleRows
        }))
      }, 10)
    }
	}
}

export const updateSheetGroupReducer = (groupId: string, updates: ISheetGroupUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_GROUP,
    groupId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Groups
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
// Update Sheet Row
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_ROW = 'UPDATE_SHEET_ROW'
interface IUpdateSheetRow {
	type: typeof UPDATE_SHEET_ROW
  rowId: string
	updates: ISheetRowUpdates
}

export const updateSheetRow = (rowId: string, updates: ISheetRowUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(updateSheetRowReducer(rowId, updates))
	}
}

export const updateSheetRowReducer = (rowId: string, updates: ISheetRowUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_ROW,
    rowId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Rows
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
// Update Sheet Selection
//-----------------------------------------------------------------------------
const removeSelectionCellState: ISheetCellUpdates = {
  isCellSelected: false
}

export const allowSelectedCellEditing = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: { 
          selections
        }
      }
    } = getState().sheet
    dispatch(updateSheet(sheetId, {
      selections: {
        ...selections,
        isSelectedCellEditingPrevented: false
      }
    }, true))
  }
}

export const allowSelectedCellNavigation = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: { 
          selections
        }
      }
    } = getState().sheet
    dispatch(updateSheet(sheetId, {
      selections: {
        ...selections,
        isSelectedCellNavigationPrevented: false
      }
    }, true))
  }
}

export const clearSheetSelection = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: { 
          selections: {
            rangeStartCellId,
            rangeEndCellId
          }
        }
      }
    } = getState().sheet
    batch(() => {
      // Reset selection state
      dispatch(updateSheet(sheetId, { selections: defaultSheetSelections }, true))
      // Clear the selected cell, the range start cell and the range end cell
      rangeStartCellId !== null && dispatch(updateSheetCellReducer(rangeStartCellId, removeSelectionCellState))
      rangeEndCellId !== null && dispatch(updateSheetCellReducer(rangeEndCellId, removeSelectionCellState))
    })
  }
}

export const preventSelectedCellEditing = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: { 
          selections
        }
      }
    } = getState().sheet
    dispatch(updateSheet(sheetId, {
      selections: {
        ...selections,
        isSelectedCellEditingPrevented: true
      }
    }, true))
  }
}

export const preventSelectedCellNavigation = (sheetId: ISheet['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets: {
        [sheetId]: { 
          selections
        }
      }
    } = getState().sheet
    dispatch(updateSheet(sheetId, {
      selections: {
        ...selections,
        isSelectedCellNavigationPrevented: true
      }
    }, true))
  }
}

export const selectSheetColumns = (sheetId: ISheet['id'], startColumnId: ISheetColumn['id'], endColumnId?: ISheetColumn['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetRows,
      allSheets: { 
        [sheetId]: { 
          selections,
          visibleColumns, 
          visibleRows 
        }
      }
    } = getState().sheet

    const startColumnIndex = visibleColumns.indexOf(startColumnId)
    const endColumnIndex = endColumnId ? visibleColumns.indexOf(endColumnId) : visibleColumns.indexOf(startColumnId)
    const nextRangeStartColumnId = visibleColumns[startColumnIndex]
    const nextRangeEndColumnId = visibleColumns[endColumnIndex]

    const nextRangeStartRow = allSheetRows[visibleRows[0]]
    const nextRangeEndRowIndex = visibleRows[visibleRows.length - 1] === 'ROW_BREAK' ? visibleRows.length - 2 : visibleRows.length - 1
    const nextRangeEndRow =  allSheetRows[visibleRows[nextRangeEndRowIndex]]
    
    const nextRangeStartCellId = nextRangeStartRow.cells[startColumnId]
    const nextRangeEndCellId = endColumnId ? nextRangeEndRow.cells[endColumnId] : nextRangeEndRow.cells[startColumnId]

    const nextRangeCellIds = new Set() as Set<string>
    for(let columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++) {
      const columnId = visibleColumns[columnIndex]
      if(columnId && columnId !== 'COLUMN_BREAK') {
        visibleRows.forEach(rowId => {
          if(rowId && rowId !== 'ROW_BREAK') {
            const cellId = allSheetRows[rowId].cells[columnId]
            nextRangeCellIds.add(cellId)
          }
        })
      }
    }
    dispatch(updateSheetCell(selections.rangeStartCellId, { isCellSelected: false }, null, true))
    dispatch(updateSheetCell(nextRangeStartCellId, { isCellSelected: true }, null, true))
    dispatch(updateSheet(sheetId, { 
      selections: {
        ...selections,
        rangeCellIds: nextRangeCellIds,
        rangeStartCellId: nextRangeStartCellId,
        rangeStartColumnId: nextRangeStartColumnId,
        rangeStartRowId: nextRangeStartRow.id,
        rangeEndCellId: nextRangeEndCellId,
        rangeEndColumnId: nextRangeEndColumnId,
        rangeEndRowId: nextRangeEndRow.id,
      }
    }, true))
  }
}

export const selectSheetRows = (sheetId: ISheet['id'], startRowId: ISheetRow['id'], endRowId?: ISheetRow['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetRows,
      allSheets: { 
        [sheetId]: { 
          selections,
          visibleColumns, 
          visibleRows 
        } 
      }
    } = getState().sheet
    
    const startRowIdVisibleRowsIndex = visibleRows.indexOf(startRowId)
    const endRowIdVisibleRowsIndex = endRowId ? visibleRows.indexOf(endRowId) : visibleRows.indexOf(startRowId)
    const nextStartRowIndex = Math.min(startRowIdVisibleRowsIndex, endRowIdVisibleRowsIndex)
    const nextEndRowIndex = Math.max(startRowIdVisibleRowsIndex, endRowIdVisibleRowsIndex)
    const nextRangeStartRowId = visibleRows[nextStartRowIndex]
    const nextRangeEndRowId = visibleRows[nextEndRowIndex]
    
    const nextRangeStartRow = allSheetRows[nextRangeStartRowId]
    const nextRangeStartRowIndex = visibleRows.indexOf(nextRangeStartRow.id)
    const nextRangeStartColumnId = visibleColumns[0]
    const nextRangeStartCellId = nextRangeStartRow.cells[nextRangeStartColumnId]
    const nextRangeEndRow = allSheetRows[nextRangeEndRowId]
    const nextRangeEndRowIndex = visibleRows.indexOf(nextRangeEndRow.id)
    const nextRangeEndColumnId = visibleColumns[Math.max(0, visibleColumns.length - 1)]
    const nextRangeEndCellId = nextRangeEndRow.cells[nextRangeEndColumnId]

    const nextRangeCellIds = new Set() as Set<string>
    for(let rowIndex = nextRangeStartRowIndex; rowIndex <= nextRangeEndRowIndex; rowIndex++) {
      const rowId = visibleRows[rowIndex]
      if(rowId && rowId !== 'ROW_BREAK') {
        visibleColumns.forEach(columnId => {
          if(columnId && columnId !== 'COLUMN_BREAK') {
            const cellId = allSheetRows[rowId].cells[columnId]
            nextRangeCellIds.add(cellId)
          }
        })
      }
    }
    dispatch(updateSheetCell(selections.rangeStartCellId, { isCellSelected: false }, null, true))
    dispatch(updateSheetCell(nextRangeStartCellId, { isCellSelected: true }, null, true))
    dispatch(updateSheet(sheetId, { 
      selections: {
        ...selections,
        rangeCellIds: nextRangeCellIds,
        rangeStartCellId: nextRangeStartCellId,
        rangeStartColumnId: nextRangeStartColumnId,
        rangeStartRowId: nextRangeStartRow.id,
        rangeEndCellId: nextRangeEndCellId,
        rangeEndColumnId: nextRangeEndColumnId,
        rangeEndRowId: nextRangeEndRow.id,
      }
    }, true))
  }
}

export const updateSheetSelectionFromArrowKey = (sheetId: ISheet['id'], cellId: ISheetCell['id'], moveDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      allSheetRows,
      allSheets: { 
        [sheetId]: {
          visibleColumns,
          visibleRows,
          selections
        }
      }
    } = getState().sheet
    // Cell
    const cell = allSheetCells[cellId]
    // Column and row indexes
    const selectedCellColumnIndex = visibleColumns.indexOf(cell.columnId)
    const selectedCellRowIndex = visibleRows.indexOf(cell.rowId)
    // Next column and row indexes
    let nextSelectedCellColumnIndex = Math.min(visibleColumns.length - 1, Math.max(0,
      !['RIGHT', 'LEFT'].includes(moveDirection) 
        ? selectedCellColumnIndex 
        : (moveDirection === 'RIGHT' ? selectedCellColumnIndex + 1 : selectedCellColumnIndex - 1)
    ))
    let nextSelectedCellRowIndex = Math.min(visibleRows.length - 1, Math.max(0,
      !['UP', 'DOWN'].includes(moveDirection) 
        ? selectedCellRowIndex 
        : (moveDirection === 'UP' ? selectedCellRowIndex - 1 : selectedCellRowIndex + 1)
    ))
    // Next column and row ids
    let nextSelectedCellRowId = visibleRows[nextSelectedCellRowIndex]
    while(nextSelectedCellRowId === 'ROW_BREAK') { // Row breaks are not selectable, skip over them
      nextSelectedCellRowIndex = Math.min(visibleRows.length, Math.max(0, (moveDirection === 'UP' ? nextSelectedCellRowIndex - 1 : nextSelectedCellRowIndex + 1)))
      nextSelectedCellRowId = visibleRows[nextSelectedCellRowIndex]
    }
    let nextSelectedCellColumnId = visibleColumns[nextSelectedCellColumnIndex]
    while(nextSelectedCellColumnId === 'COLUMN_BREAK') { // Column breaks are not selectable, skip over them
      nextSelectedCellColumnIndex = Math.min(visibleColumns.length - 1, Math.max(0, (moveDirection === 'RIGHT' ? nextSelectedCellColumnIndex + 1 : nextSelectedCellColumnIndex - 1)))
      nextSelectedCellColumnId = visibleColumns[nextSelectedCellColumnIndex]
    }
    // Next row and cell
    const nextSelectedCellRow = allSheetRows[nextSelectedCellRowId]
    const nextSelectedCell = nextSelectedCellRow ? allSheetCells[nextSelectedCellRow.cells[nextSelectedCellColumnId]] : null
    // If we selected a cell, update the sheet state
    if(nextSelectedCell !== null) {
      batch(() => {
        // Reset selection state
        dispatch(updateSheet(sheetId, {
          selections: {
            ...defaultSheetSelections,
            rangeStartColumnId: nextSelectedCell.columnId, 
            rangeStartRowId: nextSelectedCell.rowId, 
            rangeStartCellId: nextSelectedCell.id
          }
        }, true))
        // Clear the current selections
        selections.rangeStartCellId !== null && dispatch(updateSheetCellReducer(selections.rangeStartCellId, removeSelectionCellState))
        selections.rangeEndCellId !== null && dispatch(updateSheetCellReducer(selections.rangeEndCellId, removeSelectionCellState))
        // Update the next selected cell
        dispatch(updateSheetCellReducer(nextSelectedCell.id, {
          isCellSelected: true
        }))
      })
    }
  }
}

export const updateSheetSelectionFromCellClick = (sheetId: string, cellId: string, isShiftClicked: boolean): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheetCells,
      allSheetRows,
      allSheets: {
        [sheetId]: { 
          selections,
          visibleColumns,
          visibleRows,
        }
      }
    } = getState().sheet
    const cell = allSheetCells[cellId]

    const selectCell = () => {
      batch(() => {
        const nextSelectionsRangeCellIds = selections.rangeCellIds.size > 0 ? new Set() as Set<ISheetCell['id']> : selections.rangeCellIds
        dispatch(updateSheetCellReducer(selections.rangeStartCellId, removeSelectionCellState))
        dispatch(updateSheetCellReducer(cell.id, { isCellSelected: true }))
        dispatch(updateSheet(sheetId, {
          selections: {
            ...selections,
            rangeCellIds: nextSelectionsRangeCellIds,
            rangeStartCellId: cell.id,
            rangeStartColumnId: cell.columnId,
            rangeStartRowId: cell.rowId,
            rangeEndCellId: null,
            rangeEndColumnId: null,
            rangeEndRowId: null
          }
        }, true))
      })
    }

    if(!isShiftClicked) {
      selectCell()
    }
    else if(isShiftClicked) {
      // Range start and end column and row indexes
      const cellColumnIndex = visibleColumns.indexOf(cell.columnId)
      const cellRowIndex = visibleRows.indexOf(cell.rowId)
      const rangeStartColumnIndex = visibleColumns.indexOf(selections.rangeStartColumnId)
      const rangeStartRowIndex = visibleRows.indexOf(selections.rangeStartRowId)
      const rangeEndColumnIndex = Math.max(...[cellColumnIndex, visibleColumns.indexOf(selections.rangeEndColumnId)].filter(value => value !== null))
      const rangeEndRowIndex = Math.max(...[cellRowIndex, visibleRows.indexOf(selections.rangeEndRowId)].filter(value => value !== null))
      if(cellColumnIndex < rangeStartColumnIndex || cellRowIndex < rangeStartRowIndex) {
        selectCell()
      }
      else {
        // Next sheet selection cell ids
        const nextSheetSelectionRangeCellIds = new Set([ ...selections.rangeCellIds ])
        for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
          const rowId = visibleRows[rowIndex]
          if(rowId !== 'ROW_BREAK') {
            const row = allSheetRows[rowId]
            for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
              const columnId = visibleColumns[columnIndex]
              if(columnId !== 'COLUMN_BREAK') {
                const cellId = row.cells[columnId]
                nextSheetSelectionRangeCellIds.add(cellId)
              }
            }
          }
        }
      
        dispatch(updateSheet(sheetId, {
          selections: {
            ...selections,
            rangeCellIds: nextSheetSelectionRangeCellIds,
            rangeEndCellId: cell.id,
            rangeEndColumnId: visibleColumns[rangeEndColumnIndex],
            rangeEndRowId: visibleRows[rangeEndRowIndex],
          }
        }, true))
      }
    }
  }
}

//-----------------------------------------------------------------------------
// Update Sheet Sort
//-----------------------------------------------------------------------------
export const UPDATE_SHEET_SORT = 'UPDATE_SHEET_SORT'
interface IUpdateSheetSort {
	type: typeof UPDATE_SHEET_SORT
  sortId: string
	updates: ISheetSortUpdates
}

export const updateSheetSort = (sheetId: ISheet['id'], sortId: string, updates: ISheetSortUpdates, skipVisibleRowsUpdate?: boolean): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    dispatch(updateSheetSortReducer(sortId, updates))
    mutation.updateSheetSort(sortId, updates)
    if(!skipVisibleRowsUpdate) {
      setTimeout(() => {
        const {
          allSheets,
          allSheetCells,
          allSheetFilters,
          allSheetGroups,
          allSheetRows,
          allSheetSorts,
        } = getState().sheet
        const sheet = allSheets[sheetId]
        const nextSheetVisibleRows = resolveSheetVisibleRows(sheet, allSheetRows, allSheetCells, allSheetFilters, allSheetGroups, allSheetSorts)
        const nextSheetRowLeaders = resolveSheetRowLeaders(nextSheetVisibleRows)
        dispatch(clearSheetSelection(sheetId))
        dispatch(updateSheet(sheetId, {
          rowLeaders: nextSheetRowLeaders,
          visibleRows: nextSheetVisibleRows
        }))
      }, 10)
    }
	}
}

export const updateSheetSortReducer = (sortId: string, updates: ISheetSortUpdates): ISheetActions => {
	return {
		type: UPDATE_SHEET_SORT,
    sortId,
		updates,
	}
}

//-----------------------------------------------------------------------------
// Update Sheet Sorts
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
// Update Sheet Styles
//-----------------------------------------------------------------------------
export const updateSheetStyles = (sheetId: ISheet['id'], updates: ISheetStylesUpdates): IThunkAction => {	
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allSheets
    } = getState().sheet
    const sheet = allSheets[sheetId]
    // Update state
    dispatch(updateSheet(sheetId, { styles: {
      ...sheet.styles,
      ...updates
    }}, true))
    // Server update
    const serverUpdates: any = {}
    Object.entries(updates).forEach(([key, update]) => {
      if(update instanceof Set) {
        serverUpdates[key] = [ ...update ]
      }
      else {
        serverUpdates[key] = update
      }
    })
    mutation.updateSheetStyles(sheet.styles.id, serverUpdates as ISheetStylesServerUpdates)
	}
}