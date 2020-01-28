//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import clone from '@/utils/clone'
import { mutation } from '@/api'
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { 
  IFile, IAllFilePermissions, IFilePermission, IFilePermissionUpdates, IAllFiles, IFileUpdates, 
  IFolder, IAllFolderPermissions, IFolderPermission, IFolderPermissionUpdates, IAllFolders, IFolderUpdates,
  IFolderClipboardUpdates, 
} from '@/state/folder/types'
import { createHistoryStep } from '@/state/history/actions'
import { closeTab } from '@/state/tab/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IFolderActions = 
  ISetAllFolderPermissions | IUpdateFolderPermission |
  ISetAllFolders | IUpdateFolder | 
  ISetAllFilePermissions | IUpdateFilePermission |
  ISetAllFiles | IUpdateFile | 
  IUpdateActiveFolderPath | 
  IUpdateActiveFileId | 
  IUpdateClipboard |
  IUpdateUserFileIds

//-----------------------------------------------------------------------------
// Thunk Actions
//-----------------------------------------------------------------------------
export { createFolder } from '@/state/folder/actions/createFolder'
export { createFile } from '@/state/folder/actions/createFile'

export { createFolderPermissions } from '@/state/folder/actions/createFolderPermissions'
export { deleteFolderPermissions } from '@/state/folder/actions/deleteFolderPermissions'
export { createFilePermissions } from '@/state/folder/actions/createFilePermissions'
export { deleteFilePermissions } from '@/state/folder/actions/deleteFilePermissions'

//-----------------------------------------------------------------------------
// Set All Folder Permissions
//-----------------------------------------------------------------------------
export const SET_ALL_FOLDER_PERMISSIONS = 'SET_ALL_FOLDER_PERMISSIONS'
interface ISetAllFolderPermissions {
  type: typeof SET_ALL_FOLDER_PERMISSIONS
  nextAllFolderPermissions: IAllFolderPermissions
}

export const setAllFolderPermissions = (nextAllFolderPermissions: IAllFolderPermissions): IFolderActions => {
	return {
		type: SET_ALL_FOLDER_PERMISSIONS,
    nextAllFolderPermissions
	}
}

//-----------------------------------------------------------------------------
// Set All File Permissions
//-----------------------------------------------------------------------------
export const SET_ALL_FILE_PERMISSIONS = 'SET_ALL_FILE_PERMISSIONS'
interface ISetAllFilePermissions {
  type: typeof SET_ALL_FILE_PERMISSIONS
  nextAllFilePermissions: IAllFilePermissions
}

export const setAllFilePermissions = (nextAllFilePermissions: IAllFilePermissions): IFolderActions => {
	return {
		type: SET_ALL_FILE_PERMISSIONS,
    nextAllFilePermissions
	}
}

//-----------------------------------------------------------------------------
// Set All Folders
//-----------------------------------------------------------------------------
export const SET_ALL_FOLDERS = 'SET_ALL_FOLDERS'
interface ISetAllFolders {
  type: typeof SET_ALL_FOLDERS
  nextAllFolders: IAllFolders
}

export const setAllFolders = (nextAllFolders: IAllFolders): IFolderActions => {
	return {
		type: SET_ALL_FOLDERS,
    nextAllFolders
	}
}

//-----------------------------------------------------------------------------
// Set All Files
//-----------------------------------------------------------------------------
export const SET_ALL_FILES = 'SET_ALL_FILES'
interface ISetAllFiles {
  type: typeof SET_ALL_FILES
  nextAllFiles: IAllFiles
}

export const setAllFiles = (nextAllFiles: IAllFiles): IFolderActions => {
	return {
		type: SET_ALL_FILES,
    nextAllFiles
	}
}


//-----------------------------------------------------------------------------
// Update Active Folder Path
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_FILE_ID = 'UPDATE_ACTIVE_FILE_ID'
interface IUpdateActiveFileId {
	type: typeof UPDATE_ACTIVE_FILE_ID
	nextActiveFileId: IFile['id']
	nextActiveFolderPath: IFolder['id'][]
}

export const updateActiveFileId = (nextActiveFileId: IFile['id'], nextActiveFolderPath: IFolder['id'][]): IFolderActions => {
	return {
		type: UPDATE_ACTIVE_FILE_ID,
		nextActiveFileId: nextActiveFileId,
    nextActiveFolderPath: nextActiveFolderPath
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
// Delete File
//-----------------------------------------------------------------------------
export const deleteFile = (fileId: string) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: {
        allFiles,
        allFolders,
        userFileIds
      },
      tab: {
        tabs
      }
    } = getState()
    const file = allFiles[fileId]
    if(file) {
      if(file.folderId) {
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
      if(file.userId) {
        const actions = () => {
          batch(() => {
            if(tabs.includes(fileId)) {
              dispatch(closeTab(fileId))
            }
            dispatch(updateUserFileIds(userFileIds.filter(currentFileId => fileId !== currentFileId)))
          })
          mutation.deleteFile(fileId)
        }
        const undoActions = () => {
          dispatch(updateUserFileIds(userFileIds))
          mutation.restoreFile(fileId)
        }
        dispatch(createHistoryStep({actions, undoActions}))
        actions()
      }
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
// Update File Permissions
//-----------------------------------------------------------------------------
export const UPDATE_FILE_PERMISSION = 'UPDATE_FILE_PERMISSION'
interface IUpdateFilePermission {
	type: typeof UPDATE_FILE_PERMISSION
  filePermissionId: IFilePermission['id']
  updates: IFilePermissionUpdates
}

export const updateFilePermission = (filePermissionId: IFilePermission['id'], updates: IFilePermissionUpdates) => {	
  return async (dispatch: IThunkDispatch) => {
    dispatch(updateFilePermissionReducer(filePermissionId, updates))
    mutation.updateFilePermission(filePermissionId, updates)
  }
}

export const updateFilePermissionReducer = (filePermissionId: IFilePermission['id'], updates: IFilePermissionUpdates): IFolderActions => {
	return {
		type: UPDATE_FILE_PERMISSION,
    filePermissionId,
    updates
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
// Update Folder Permissions
//-----------------------------------------------------------------------------
export const UPDATE_FOLDER_PERMISSION = 'UPDATE_FOLDER_PERMISSION'
interface IUpdateFolderPermission {
	type: typeof UPDATE_FOLDER_PERMISSION
  folderPermissionId: IFolderPermission['id']
  updates: IFolderPermissionUpdates
}

export const updateFolderPermission = (folderPermissionId: IFolderPermission['id'], updates: IFolderPermissionUpdates) => {	
  return async (dispatch: IThunkDispatch) => {
    dispatch(updateFolderPermissionReducer(folderPermissionId, updates))
    mutation.updateFolderPermission(folderPermissionId, updates)
  }
}

export const updateFolderPermissionReducer = (folderPermissionId: IFolderPermission['id'], updates: IFolderPermissionUpdates): IFolderActions => {
	return {
		type: UPDATE_FOLDER_PERMISSION,
    folderPermissionId,
    updates
	}
}

//-----------------------------------------------------------------------------
// Update User File Ids
//-----------------------------------------------------------------------------
export const UPDATE_USER_FILE_IDS = 'UPDATE_USER_FILE_IDS'
interface IUpdateUserFileIds {
	type: typeof UPDATE_USER_FILE_IDS
  nextUserFileIds: IFile['id'][]
}

export const updateUserFileIds = (nextUserFileIds: IFile['id'][]): IFolderActions => {
	return {
		type: UPDATE_USER_FILE_IDS,
		nextUserFileIds
	}
}