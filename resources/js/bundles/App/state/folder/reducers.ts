//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@app/state/initialData'
import { File, Files, Folder, Folders } from '@app/state/folder/types'
import normalizer from '@app/state/folder/normalizer'
import {
	FolderActions,
	UPDATE_FOLDER,
	UPDATE_FILE,
	UPDATE_ACTIVE_FOLDER_ID,
	UPDATE_ACTIVE_FOLDER_PATH,
} from '@app/state/folder/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const normalizedFolders = normalizer(
	typeof initialData !== 'undefined' ? initialData.folders : defaultInitialData.folders
)
export const initialFoldersState: FolderState = {
	activeFolderId: null,
	activeFolderPath: [],
	folders: <Folders>normalizedFolders.entities.folder,
	files: <Files>normalizedFolders.entities.file,
	rootFolders: normalizedFolders.result,
}
export type FolderState = {
	activeFolderId: string
	activeFolderPath: string[]
	folders: { [key: string]: Folder }
	files: { [key: string]: File }
	rootFolders: string[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialFoldersState, action: FolderActions): FolderState => {
	switch (action.type) {
		case UPDATE_ACTIVE_FOLDER_ID: {
			const { nextActiveFolderId } = action
			return {
				...state,
				activeFolderId: nextActiveFolderId,
			}
		}

		case UPDATE_ACTIVE_FOLDER_PATH: {
			const { nextActiveFolderPath } = action
			return {
				...state,
				activeFolderPath: nextActiveFolderPath,
			}
		}

		case UPDATE_FOLDER: {
			const { id, updates } = action
			return {
				...state,
				folders: {
					...state.folders,
					[id]: {
						...state.folders[id],
						...updates,
					},
				},
			}
		}

		case UPDATE_FILE: {
			const { id, updates } = action
			return {
				...state,
				files: {
					...state.files,
					[id]: {
						...state.files[id],
						...updates,
					},
				},
			}
		}

		default:
			return state
	}
}

export default userReducer
