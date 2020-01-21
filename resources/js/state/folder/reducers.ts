//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@/state/initialData'
import { 
  IFile, IFiles, 
  IFolder, IFolderFromDatabase, IFolders,
  IFolderClipboard, 
} from '@/state/folder/types'
import {
  IFolderActions,
  CREATE_FILE,
  CREATE_FOLDER,
  UPDATE_ACTIVE_FOLDER_PATH,
  UPDATE_CLIPBOARD,
	UPDATE_FOLDER,
  UPDATE_FILE,
  UPDATE_FILES,
  UPDATE_FOLDERS,
  UPDATE_IS_SAVING_NEW_FILE
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const initialFolderData = typeof initialData !== 'undefined' ? initialData.folders : defaultInitialData.folders

// Function to set the normalized folders and files
const setNormalizedFoldersAndFiles = () => {
  // Variables
  const allFolders: IFolders = {}
  const allFiles: IFiles = {}
  const rootFolderIds = initialFolderData.map(folder => folder.id)
  
  // Get Folders and Files From Folder
  const getFolderAndFilesFromFolder = (folder: IFolderFromDatabase, parentFolderUsers?: IFolderFromDatabase['users']) => {
    const folderUsers = parentFolderUsers ? [ ...parentFolderUsers, ...folder.users ] : folder.users
    allFolders[folder.id] = {
      id: folder.id,
      name: folder.name,
      folderId: folder.folderId,
      folders: folder.folders.map(folder => folder.id),
      files: folder.files.map(file => file.id),
      users: folderUsers
    }
    folder.files.forEach(file => {
      allFiles[file.id] = {
        id: file.id,
        folderId: file.folderId,
        name: file.name,
        type: file.type,
        typeId: file.typeId,
        isPreventedFromSelecting: false
      }
    })
    folder.folders.forEach(currentFolder => getFolderAndFilesFromFolder(currentFolder, folderUsers))
  }
  
  // Get the folders and files for each of the root folders
  initialFolderData.forEach(currentFolder => getFolderAndFilesFromFolder(currentFolder, null))
  
  // Return the normalized objects
  return { allFolders, allFiles, rootFolderIds }
}

// Get the normalized folders and files
const { allFolders, allFiles, rootFolderIds } = setNormalizedFoldersAndFiles()

// Initial Folder State
export const initialFolderState: IFolderState = {
  activeFolderPath: [initialFolderData[0].id],
  clipboard: { 
    itemId: null, 
    cutOrCopy: null, 
    folderOrFile: null 
  },
	folders: allFolders,
  files: allFiles,
  isSavingNewFile: false,
  onFileSave: null,
	rootFolderIds: rootFolderIds,
}
export type IFolderState = {
  activeFolderPath: string[]
  clipboard: IFolderClipboard
	folders: { [key: string]: IFolder }
  files: { [key: string]: IFile }
  onFileSave(...args: any): void
  isSavingNewFile: boolean
	rootFolderIds: string[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const folderReducer = (state = initialFolderState, action: IFolderActions): IFolderState => {
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
