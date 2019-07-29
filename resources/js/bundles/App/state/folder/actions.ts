//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Dispatch } from 'redux'

import { mutation } from '@app/api'
import { AppState } from '@app/state'
import { ThunkAction } from '@app/state/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type FolderActions = UpdateActiveFolderPath | UpdateFolder | UpdateFile

//-----------------------------------------------------------------------------
// Update Active Folder Path
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_FOLDER_PATH = 'UPDATE_ACTIVE_FOLDER_PATH'
interface UpdateActiveFolderPath {
	type: typeof UPDATE_ACTIVE_FOLDER_PATH
	nextActiveFolderPath: string[]
}

export const updateActiveFolderPath = (level: number, nextActiveFolderId: string): ThunkAction => {
	return async (dispatch: Dispatch, getState: () => AppState) => {
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
// Update Folder Color
//-----------------------------------------------------------------------------
export const UPDATE_FILE = 'UPDATE_FILE'
export type FileUpdates = {
	name?: string
}
interface UpdateFile {
	type: typeof UPDATE_FILE
	id: string
	updates: FileUpdates
}

let updateFileTimeout: number = null
export const updateFile = (id: string, updates: FileUpdates) => {
	return async (dispatch: Dispatch, getState: () => AppState) => {
		window.clearTimeout(updateFileTimeout)
		dispatch(updateFileReducer(id, updates))
		updateFileTimeout = window.setTimeout(() => mutation.updateFile(getState().user.color.id, updates), 1500)
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
	return async (dispatch: Dispatch, getState: () => AppState) => {
		dispatch(updateFolderReducer(id, updates))
		mutation.updateFolder(getState().user.layout.id, updates)
	}
}

export const updateFolderReducer = (id: string, updates: FolderUpdates): FolderActions => {
	return {
		type: UPDATE_FOLDER,
		id: id,
		updates: updates,
	}
}
