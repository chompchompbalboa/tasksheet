//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Dispatch } from 'redux'

import { mutation } from '@app/api'
import { AppState } from '@app/state'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type FolderActions = UpdateActiveFolderId | UpdateActiveFolderPath | UpdateFolder | UpdateFile

//-----------------------------------------------------------------------------
// Update Active Folder Id
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_FOLDER_ID = 'UPDATE_ACTIVE_FOLDER_ID'
interface UpdateActiveFolderId {
	type: typeof UPDATE_ACTIVE_FOLDER_ID
	nextActiveFolderId: string
}

export const updateActiveFolderId = (nextActiveFolderId: string) => {
	return async (dispatch: Dispatch, getState: () => AppState) => {
		dispatch(updateActiveFolderIdReducer(nextActiveFolderId))
		if (nextActiveFolderId === null) {
			dispatch(updateActiveFolderPath([]))
		} else {
			const activeFolderPath = getState().folder.activeFolderPath
			const nextActiveFolderIdIndex = activeFolderPath.indexOf(nextActiveFolderId)
			const nextActiveFolderPath =
				nextActiveFolderIdIndex > -1
					? [...activeFolderPath.slice(0, nextActiveFolderIdIndex), nextActiveFolderId]
					: [...activeFolderPath, nextActiveFolderId]
			dispatch(updateActiveFolderPath(nextActiveFolderPath))
		}
	}
}

export const updateActiveFolderIdReducer = (nextActiveFolderId: string): FolderActions => {
	return {
		type: UPDATE_ACTIVE_FOLDER_ID,
		nextActiveFolderId: nextActiveFolderId,
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

export const updateActiveFolderPath = (nextActiveFolderPath: string[]): FolderActions => {
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
