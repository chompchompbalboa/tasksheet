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
  ISheetView
} from '@app/state/sheet/types'

import { loadSheetReducer } from '@app/state/sheet/actions'
import { updateFiles, updateFolders } from '@app/state/folder/actions'
import { updateTabs } from '@app/state/tab/actions'

import { defaultSheetSelections, defaultSheetStyles } from '@app/state/sheet/defaults'

//-----------------------------------------------------------------------------
// Create Sheet Link
//-----------------------------------------------------------------------------
export const createSheetLink = (sheetId: string, newSheetLinkName: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: { 
        activeFolderPath, 
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
    const folderId = activeFolderPath[activeFolderPath.length - 1]
    const newFileId = createUuid()

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
        views: []
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
      null, // Cell Notes
      null, // Notes
    ))
    // Update folders and files
    const newFile = {
      ...files[fileId],
      id: newFileId,
      folderId: folderId,
      type: 'SHEET' as IFileType, 
      name: newSheetLinkName,
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
    mutation.createFile(newFile)
    // Create the sheet view on the server
    mutation.createSheetLink({
      id: newLinkedSheetId,
      sourceSheetId: sourceSheet.sourceSheetId || sourceSheet.id,
      activeSheetViewId: newLinkedSheetActiveSheetView.id,
      activeSheetViewName: newSheetLinkName,
      activeSheetViewVisibleColumns: newLinkedSheetActiveSheetView.visibleColumns,
    })
	}
}