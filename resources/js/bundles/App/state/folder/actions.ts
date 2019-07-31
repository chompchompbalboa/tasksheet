//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'
import { AppState } from '@app/state'
import { ThunkAction, ThunkDispatch } from '@app/state/types'
import { Files, Folder, Folders, FileType } from '@app/state/folder/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type FolderActions = 
  UpdateActiveFileId | UpdateActiveFolderPath | 
  CreateFolder | UpdateFolder | UpdateFolders | 
  UpdateFile | UpdateFiles | 
  UpdateIsSavingNewFile

//-----------------------------------------------------------------------------
// Defaults
//-----------------------------------------------------------------------------
const defaultFolder = (folderId: string): Folder => {
  return {
    id: createUuid(),
    folderId: folderId,
    name: null,
    files: [],
    folders: [],
  }
}

//-----------------------------------------------------------------------------
// Update Active File Id
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_FILE_ID = 'UPDATE_ACTIVE_FILE_ID'
interface UpdateActiveFileId {
	type: typeof UPDATE_ACTIVE_FILE_ID
	nextActiveFileId: string
}

export const updateActiveFileId = (nextActiveFileId: string): FolderActions => {
	return {
		type: UPDATE_ACTIVE_FILE_ID,
		nextActiveFileId: nextActiveFileId,
	}
}

//-----------------------------------------------------------------------------
// Update Active Folder Path
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_FOLDER_PATH = 'UPDATE_ACTIVE_FOLDER_PATH'
interface UpdateActiveFolderPath {
	type: typeof UPDATE_ACTIVE_FOLDER_PATH
	nextActiveFolderPath: string[]
}

export const updateActiveFolderPath = (level: number, nextActiveFolderId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      activeFolderPath
    } = getState().folder
    if(!activeFolderPath.includes(nextActiveFolderId)) {
      const nextActiveFolderPath = [ ...activeFolderPath.slice(0, level), nextActiveFolderId ]
      dispatch(updateActiveFolderPathReducer(nextActiveFolderPath))
    }
  }
}

export const updateActiveFolderPathReducer = (nextActiveFolderPath: string[]): FolderActions => {
	return {
		type: UPDATE_ACTIVE_FOLDER_PATH,
		nextActiveFolderPath: nextActiveFolderPath,
	}
}

//-----------------------------------------------------------------------------
// Create File
//-----------------------------------------------------------------------------
export const CREATE_FOLDER = 'CREATE_FOLDER'
interface CreateFolder {
	type: typeof CREATE_FOLDER
  folderId: string
  newFolderId: string
  newFolder: Folder
}

export const createFolder = (folderId: string) => {
	return async (dispatch: ThunkDispatch) => {
    const newFolder = defaultFolder(folderId)
    dispatch(createFolderReducer(folderId, newFolder.id, newFolder))
    mutation.createFolder(newFolder)
	}
}

export const createFolderReducer = (folderId: string, newFolderId: string, newFolder: Folder): FolderActions => {
	return {
    type: CREATE_FOLDER,
    folderId,
    newFolderId,
    newFolder
	}
}

//-----------------------------------------------------------------------------
// Update File
//-----------------------------------------------------------------------------
export const UPDATE_FILE = 'UPDATE_FILE'
export type FileUpdates = {
  name?: string
  type?: FileType
}
interface UpdateFile {
	type: typeof UPDATE_FILE
	id: string
	updates: FileUpdates
}

let updateFileTimeout: number = null
export const updateFile = (id: string, updates: FileUpdates, skipServerUpdate?: boolean) => {
	return async (dispatch: ThunkDispatch) => {
		if(!skipServerUpdate) { window.clearTimeout(updateFileTimeout) }
		dispatch(updateFileReducer(id, updates))
		if(!skipServerUpdate) { updateFileTimeout = window.setTimeout(() => mutation.updateFile(id, updates), 1500) }
	}
}

export const updateFileReducer = (id: string, updates: FileUpdates): FolderActions => {
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
interface UpdateFiles {
	type: typeof UPDATE_FILES
  nextFiles: Files
}

export const updateFiles = (nextFiles: Files): FolderActions => {
	return {
		type: UPDATE_FILES,
		nextFiles
	}
}

//-----------------------------------------------------------------------------
// Update Folder
//-----------------------------------------------------------------------------
export const UPDATE_FOLDER = 'UPDATE_FOLDER'
export type FolderUpdates = {
	name?: string
}
interface UpdateFolder {
	type: typeof UPDATE_FOLDER
	id: string
	updates: FolderUpdates
}

export const updateFolder = (id: string, updates: FolderUpdates) => {
	return async (dispatch: ThunkDispatch) => {
		dispatch(updateFolderReducer(id, updates))
		mutation.updateFolder(id, updates)
	}
}

export const updateFolderReducer = (id: string, updates: FolderUpdates): FolderActions => {
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
interface UpdateFolders {
	type: typeof UPDATE_FOLDERS
  nextFolders: Folders
}

export const updateFolders = (nextFolders: Folders): FolderActions => {
	return {
		type: UPDATE_FOLDERS,
		nextFolders
	}
}


//-----------------------------------------------------------------------------
// Update Active File Id
//-----------------------------------------------------------------------------
export const UPDATE_IS_SAVING_NEW_FILE = 'UPDATE_IS_SAVING_NEW_FILE'
interface UpdateIsSavingNewFile {
	type: typeof UPDATE_IS_SAVING_NEW_FILE
  nextIsSavingNewFile: boolean
  onFileSave: () => void
}

export const updateIsSavingNewFile = (nextIsSavingNewFile: boolean, onFileSave: () => void): FolderActions => {
	return {
		type: UPDATE_IS_SAVING_NEW_FILE,
    nextIsSavingNewFile,
    onFileSave
	}
}