//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'
import { batch } from 'react-redux'

import clone from '@/utils/clone'
import { mutation } from '@/api'
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  IFile, IAllFiles, IFileUpdates, 
  IFolder, IAllFolders, IFolderUpdates,
  IFolderClipboardUpdates, 
} from '@/state/folder/types'
import { createHistoryStep } from '@/state/history/actions'
import { closeTab } from '@/state/tab/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IFolderActions = 
  IUpdateActiveFolderPath | 
  IUpdateClipboard |
  ICreateFolder | IUpdateFolder | IUpdateFolders | 
  ICreateFile | IUpdateFile | IUpdateFiles

//-----------------------------------------------------------------------------
// Defaults
//-----------------------------------------------------------------------------
const defaultFolder = (folderId: string): IFolder => {
  return {
    id: createUuid(),
    folderId: folderId,
    name: null,
    files: [],
    folders: [],
    permissions: []
  }
}

//-----------------------------------------------------------------------------
// Update Active Folder Path
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_FOLDER_PATH = 'UPDATE_ACTIVE_FOLDER_PATH'
interface IUpdateActiveFolderPath {
	type: typeof UPDATE_ACTIVE_FOLDER_PATH
	nextActiveFolderPath: string[]
}

export const updateActiveFolderPath = (level: number, nextActiveFolderId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      activeFolderPath
    } = getState().folder
    const nextActiveFolderPath = [ ...activeFolderPath.slice(0, level), nextActiveFolderId ]
    dispatch(updateActiveFolderPathReducer(nextActiveFolderPath))
  }
}

export const updateActiveFolderPathReducer = (nextActiveFolderPath: string[]): IFolderActions => {
	return {
		type: UPDATE_ACTIVE_FOLDER_PATH,
		nextActiveFolderPath: nextActiveFolderPath,
	}
}

//-----------------------------------------------------------------------------
// Update Clipboard
//-----------------------------------------------------------------------------
export const UPDATE_CLIPBOARD = 'UPDATE_CLIPBOARD'
interface IUpdateClipboard {
  type: typeof UPDATE_CLIPBOARD
	updates: IFolderClipboardUpdates
}

export const updateClipboard = (updates: IFolderClipboardUpdates): IFolderActions => {
	return {
		type: UPDATE_CLIPBOARD,
		updates
	}
}

//-----------------------------------------------------------------------------
// Paste From Clipboard
//-----------------------------------------------------------------------------
export const pasteFromClipboard = (nextFolderId: string) => {
  return (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      clipboard: {
        itemId,
        cutOrCopy,
        folderOrFile
      },
      allFiles,
      allFolders
    } = getState().folder
    const nextFolder = allFolders[nextFolderId]
    // File
    if(folderOrFile === 'FILE') {
      const file = allFiles[itemId]
      const previousFolder = allFolders[file.folderId]
      if(previousFolder.id !== nextFolder.id) {
        // Cut
        if(cutOrCopy === 'CUT') {
          dispatch(updateFile(file.id, {
            folderId: nextFolderId
          }))
          dispatch(updateFolder(nextFolderId, {
            files: [ ...nextFolder.files, file.id ]
          }, true))
          dispatch(updateFolder(previousFolder.id, {
            files: previousFolder.files.filter(fileId => fileId !== file.id) 
          }, true))
        }
      }
    }
    // Folder
    else if(folderOrFile === 'FOLDER') {
      const folder = allFolders[itemId]
      const previousFolder = allFolders[folder.folderId]
      if(previousFolder.id !== nextFolder.id) {
        // Cut
        if(cutOrCopy === 'CUT') {
          dispatch(updateFolder(folder.id, {
            folderId: nextFolder.id
          }))
          dispatch(updateFolder(previousFolder.id, {
            folders: previousFolder.folders.filter(folderId => folderId !== folder.id) 
          }, true))
          dispatch(updateFolder(nextFolder.id, {
            folders: [ ...nextFolder.folders, folder.id ]
          }, true))
        }
      }
    }
  }
}

//-----------------------------------------------------------------------------
// Create File
//-----------------------------------------------------------------------------
export const CREATE_FILE = 'CREATE_FILE'
interface ICreateFile {
	type: typeof CREATE_FILE
  folderId: string
  newFile: IFile
}

export const createFile = (folderId: string, newFile: IFile) => {
	return async (dispatch: IThunkDispatch) => {
    dispatch(createFileReducer(folderId, newFile))
    mutation.createFile(newFile)
	}
}

export const createFileReducer = (folderId: string, newFile: IFile): IFolderActions => {
	return {
    type: CREATE_FILE,
    folderId,
    newFile
	}
}


//-----------------------------------------------------------------------------
// Create Folder
//-----------------------------------------------------------------------------
export const CREATE_FOLDER = 'CREATE_FOLDER'
interface ICreateFolder {
	type: typeof CREATE_FOLDER
  folderId: string
  newFolderId: string
  newFolder: IFolder
}

export const createFolder = (folderId: string) => {
	return async (dispatch: IThunkDispatch) => {
    const newFolder = defaultFolder(folderId)
    dispatch(createFolderReducer(folderId, newFolder.id, newFolder))
    mutation.createFolder(newFolder)
	}
}

export const createFolderReducer = (folderId: string, newFolderId: string, newFolder: IFolder): IFolderActions => {
	return {
    type: CREATE_FOLDER,
    folderId,
    newFolderId,
    newFolder
	}
}

//-----------------------------------------------------------------------------
// Delete File
//-----------------------------------------------------------------------------
export const deleteFile = (fileId: string) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: {
        allFiles,
        allFolders
      },
      tab: {
        tabs
      }
    } = getState()
    const file = allFiles[fileId]
    if(file) {
      const folder = allFolders[file.folderId]
      const folderFiles = clone(folder.files)
      const nextFolderFiles = folder.files.filter(folderFileId => folderFileId !== fileId)
      const actions = () => {
        batch(() => {
          if(tabs.includes(fileId)) {
            dispatch(closeTab(fileId))
          }
          dispatch(updateFolder(folder.id, { files: nextFolderFiles }, true))
        })
        mutation.deleteFile(fileId)
      }
      const undoActions = () => {
        dispatch(updateFolder(folder.id, { files: folderFiles }, true))
        mutation.restoreFile(fileId)
      }
      dispatch(createHistoryStep({actions, undoActions}))
      actions()
    }
	}
}

//-----------------------------------------------------------------------------
// Delete Folder
//-----------------------------------------------------------------------------
export const deleteFolder = (folderId: string) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: {
        allFolders
      }
    } = getState()
    const folder = allFolders[folderId]
    if(folder) {
      const parentFolder = allFolders[folder.folderId]
      if(parentFolder) {
        const nextParentFolderFolders = parentFolder.folders.filter(currentFolderId => currentFolderId !== folderId)
      const actions = () => {
        batch(() => {
          dispatch(updateFolder(parentFolder.id, { folders: nextParentFolderFolders }, true))
        })
        mutation.deleteFolder(folderId)
      }
      const undoActions = () => {
        dispatch(updateFolder(parentFolder.id, { folders: parentFolder.folders }, true))
        mutation.restoreFolder(folderId)
      }
      dispatch(createHistoryStep({actions, undoActions}))
      actions()
      }
    }
	}
}

//-----------------------------------------------------------------------------
// Update File
//-----------------------------------------------------------------------------
export const UPDATE_FILE = 'UPDATE_FILE'
interface IUpdateFile {
	type: typeof UPDATE_FILE
	id: string
	updates: IFileUpdates
}

let updateFileTimeout: number = null
export const updateFile = (id: string, updates: IFileUpdates, skipServerUpdate?: boolean) => {
	return async (dispatch: IThunkDispatch) => {
		if(!skipServerUpdate) { window.clearTimeout(updateFileTimeout) }
		dispatch(updateFileReducer(id, updates))
		if(!skipServerUpdate) { updateFileTimeout = window.setTimeout(() => mutation.updateFile(id, updates), 1500) }
	}
}

export const updateFileReducer = (id: string, updates: IFileUpdates): IFolderActions => {
	return {
		type: UPDATE_FILE,
		id: id,
		updates: updates,
	}
}

//-----------------------------------------------------------------------------
// Update File
//-----------------------------------------------------------------------------
export const UPDATE_FILES = 'UPDATE_FILES'
interface IUpdateFiles {
	type: typeof UPDATE_FILES
  nextFiles: IAllFiles
}

export const updateFiles = (nextFiles: IAllFiles): IFolderActions => {
	return {
		type: UPDATE_FILES,
		nextFiles
	}
}

//-----------------------------------------------------------------------------
// Update Folder
//-----------------------------------------------------------------------------
export const UPDATE_FOLDER = 'UPDATE_FOLDER'
interface IUpdateFolder {
	type: typeof UPDATE_FOLDER
	id: string
	updates: IFolderUpdates
}

export const updateFolder = (id: string, updates: IFolderUpdates, skipServerUpdate?: boolean) => {
	return async (dispatch: IThunkDispatch) => {
		dispatch(updateFolderReducer(id, updates))
		if(!skipServerUpdate) { mutation.updateFolder(id, updates) }
	}
}

export const updateFolderReducer = (id: string, updates: IFolderUpdates): IFolderActions => {
	return {
		type: UPDATE_FOLDER,
		id: id,
		updates: updates,
	}
}

//-----------------------------------------------------------------------------
// Update Folders
//-----------------------------------------------------------------------------
export const UPDATE_FOLDERS = 'UPDATE_FOLDERS'
interface IUpdateFolders {
	type: typeof UPDATE_FOLDERS
  nextFolders: IAllFolders
}

export const updateFolders = (nextFolders: IAllFolders): IFolderActions => {
	return {
		type: UPDATE_FOLDERS,
		nextFolders
	}
}