//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@app/state/initialData'
import { File, Files, Folder, Folders } from '@app/state/folder/types'
import normalizer from '@app/state/folder/normalizer'
import {
	FolderActions,
	UPDATE_ACTIVE_FILE_ID,
	UPDATE_ACTIVE_FOLDER_PATH,
	UPDATE_FOLDER,
  UPDATE_FILE,
  UPDATE_FILES,
  UPDATE_FOLDERS,
  UPDATE_IS_SAVING_NEW_FILE
} from '@app/state/folder/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const normalizedFolders = normalizer(
	typeof initialData !== 'undefined' ? initialData.folders : defaultInitialData.folders
)
export const initialFoldersState: FolderState = {
  activeFileId: null,
	activeFolderPath: [],
	folders: <Folders>normalizedFolders.entities.folder,
  files: <Files>normalizedFolders.entities.file,
  isSavingNewFile: false,
  onFileSave: null,
	rootFolderIds: normalizedFolders.result,
}
export type FolderState = {
  activeFileId: string
	activeFolderPath: string[]
	folders: { [key: string]: Folder }
  files: { [key: string]: File }
  onFileSave(...args: any): void
  isSavingNewFile: boolean
	rootFolderIds: string[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const folderReducer = (state = initialFoldersState, action: FolderActions): FolderState => {
	switch (action.type) {

		case UPDATE_ACTIVE_FILE_ID: {
      const { nextActiveFileId } = action
			return {
				...state,
				activeFileId: nextActiveFileId,
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

		case UPDATE_FILES: {
      const { nextFiles } = action
			return {
				...state,
        files: nextFiles
			}
		}

		case UPDATE_FOLDERS: {
      const { nextFolders } = action
			return {
				...state,
        folders: nextFolders
			}
		}

		case UPDATE_IS_SAVING_NEW_FILE: {
      const { nextIsSavingNewFile, onFileSave } = action
			return {
				...state,
        isSavingNewFile: nextIsSavingNewFile,
        onFileSave: onFileSave
			}
		}

		default:
			return state
	}
}

export default folderReducer
