//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { IFileType } from '@app/state/folder/types'
import { 
  IAllSheetFilters, ISheetFilter,
  IAllSheetGroups, ISheetGroup,
  IAllSheetSorts, ISheetSort
} from '@app/state/sheet/types'

import { loadSheetReducer } from '@app/state/sheet/actions'
import { updateFiles, updateFolders } from '@app/state/folder/actions'
import { updateTabs } from '@app/state/tab/actions'

import { defaultSheetSelections, defaultSheetStyles } from '@app/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Create Sheet Link
//-----------------------------------------------------------------------------
export const createSheetLink = (sheetId: string, viewName: string): IThunkAction => {
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
        sourceSheetDefaultVisibleRows: sourceSheet.defaultVisibleRows,
        defaultVisibleRows: sourceSheet.defaultVisibleRows,
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
        styles: defaultSheetStyles,
        views: []
      },
      null, // Cells
      null, // Columns
      newFilters, // Filters
      newGroups, // Groups
      null, // Rows
      newSorts, // Sorts
      null // Views
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
    mutation.createSheetLink({
      id: newSheetViewId,
      sourceSheetId: sourceSheet.id,
      defaultVisibleRows: sourceSheet.defaultVisibleRows,
      visibleColumns: sourceSheet.visibleColumns,
      filters: newFilters,
      groups: newGroups,
      sorts: newSorts
    })
	}
}