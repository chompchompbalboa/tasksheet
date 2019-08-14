//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@app/state/initialData'
import { Clipboard, File, Files, Folder, Folders } from '@app/state/folder/types'
import normalizer from '@app/state/folder/normalizer'
import {
  FolderActions,
  CREATE_FILE,
  CREATE_FOLDER,
	UPDATE_ACTIVE_FILE_ID,
  UPDATE_ACTIVE_FOLDER_PATH,
  UPDATE_CLIPBOARD,
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
  clipboard: { itemId: null, cutOrCopy: null, folderOrFile: null },
	folders: <Folders>normalizedFolders.entities.folder,
  files: <Files>normalizedFolders.entities.file,
  isSavingNewFile: false,
  onFileSave: null,
	rootFolderIds: normalizedFolders.result,
}
export type FolderState = {
  activeFileId: string
  activeFolderPath: string[]
  clipboard: Clipboard
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

    case CREATE_FILE: {
      const { folderId, newFile } = action
      return {
        ...state,
        files: {
          ...state.files,
          [newFile.id]: newFile
        },
        folders: {
          ...state.folders,
          [folderId]: {
            ...state.folders[folderId],
            files: [ ...state.folders[folderId].files, newFile.id ]
          }
        }
      }
    }

		case CREATE_FOLDER: {
      const { folderId, newFolder, newFolderId } = action
			return {
				...state,
				folders: {
					...state.folders,
					[folderId]: {
						...state.folders[folderId],
						folders: [ ...state.folders[folderId].folders, newFolderId],
          },
          [newFolderId]: newFolder
				},
			}
		}

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

		case UPDATE_CLIPBOARD: {
      const { updates } = action
			return {
				...state,
				clipboard: { ...state.clipboard, ...updates }
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
