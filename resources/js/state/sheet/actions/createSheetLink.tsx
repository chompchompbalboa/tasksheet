//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import clone from '@/utils/clone'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFileType } from '@/state/folder/types'
import { 
  ISheetView
} from '@/state/sheet/types'

import { loadSheetReducer } from '@/state/sheet/actions'
import { updateFiles, updateFolders } from '@/state/folder/actions'
import { openFileInNewTab, updateTabs } from '@/state/tab/actions'

import { defaultSheetSelections, defaultSheetStyles } from '@/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Create Sheet Link
//-----------------------------------------------------------------------------
export const createSheetLink = (sheetId: string, folderId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: { 
        files, 
        folders 
      },
      sheet: { 
        allSheets,
        allSheetViews
      },
      tab: { 
        tabs 
      }
    } = getState()
    const sourceSheet = allSheets[sheetId]
    const sourceSheetActiveSheetView = allSheetViews[sourceSheet.activeSheetViewId]

    const fileId = Object.keys(files).find(fileId => files[fileId].typeId === sheetId)
    const newFileId = createUuid()
    
    const newSheetLinkFileName = files[fileId].name + ' - Linked'

    const newLinkedSheetId = createUuid()
    const newLinkedSheetActiveSheetView: ISheetView = {
      ...sourceSheetActiveSheetView,
      id: createUuid(),
      filters: [],
      groups: [],
      sorts: []
    }

  // Update allSheets
    dispatch(loadSheetReducer(
      {
        id: newLinkedSheetId,
        sourceSheetId: sourceSheet.sourceSheetId || sourceSheet.id,
        activeSheetViewId: newLinkedSheetActiveSheetView.id,
        columns: clone(sourceSheet.columns),
        rows: clone(sourceSheet.rows),
        visibleRowLeaders: clone(sourceSheet.visibleRowLeaders),
        visibleRows: clone(sourceSheet.visibleRows),
        selections: defaultSheetSelections,
        styles: defaultSheetStyles,
        views: [],
        priorities: [],
        cellPriorities: {}
      },
      null, // Cells
      null, // Columns
      null, // Filters
      null, // Groups
      null, // Rows
      null, // Sorts
      {
        ...allSheetViews,
        [newLinkedSheetActiveSheetView.id]: newLinkedSheetActiveSheetView
      },
      null, // Changes
      null, // Files
      null, // Photos
      null, // Priorities
      null, // Cell Changes
      null, // Cell Files
      null // Cell photos
    ))
    // Update folders and files
    const newFile = {
      ...files[fileId],
      id: newFileId,
      folderId: folderId,
      type: 'SHEET' as IFileType, 
      name: newSheetLinkFileName,
      typeId: newLinkedSheetId
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
    dispatch(updateTabs([ ...tabs, newFileId ]))
    // Create the file on the server
    await mutation.createFile(newFile)
    // Create the sheet view on the server
    await mutation.createSheetLink({
      id: newLinkedSheetId,
      sourceSheetId: sourceSheet.sourceSheetId || sourceSheet.id,
      activeSheetViewId: newLinkedSheetActiveSheetView.id,
      activeSheetViewName: newSheetLinkFileName,
      activeSheetViewVisibleColumns: newLinkedSheetActiveSheetView.visibleColumns,
    })
    
    dispatch(openFileInNewTab(newFile.id))
	}
}