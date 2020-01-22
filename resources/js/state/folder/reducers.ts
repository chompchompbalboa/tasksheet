//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@/state/initialData'
import { 
  IAllFiles,
  IAllFolders, IFolderFromDatabase,
  IAllFolderPermissions, 
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
  UPDATE_FOLDERS
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const initialFolderData = typeof initialData !== 'undefined' ? initialData.folders : defaultInitialData.folders
const initialFileData = typeof initialData !== 'undefined' ? initialData.files : defaultInitialData.files

// Function to set the normalized folders and files
const setNormalizedFoldersAndFiles = () => {
  // Variables
  const allFolderPermissions: IAllFolderPermissions = {}
  const allFolders: IAllFolders = {}
  const allFiles: IAllFiles = {}
  const rootFolderIds = initialFolderData.map(folder => folder.id)
  const userFileIds = initialFileData.map(file => file.id)
  
  // Get Folders and Files From Folder
  const getFolderAndFilesFromFolder = (
    folder: IFolderFromDatabase, 
    parentFolderPermissions?: IFolderFromDatabase['permissions']
  ) => {
    const folderPermissions = parentFolderPermissions ? [ ...parentFolderPermissions, ...folder.permissions ] : folder.permissions
    const folderPermissionIds = folderPermissions.map(folderPermission => folderPermission.id)
    
    // Folder
    allFolders[folder.id] = {
      id: folder.id,
      name: folder.name,
      folderId: folder.folderId,
      folders: folder.folders.map(folder => folder.id),
      files: folder.files.map(file => file.id),
      permissions: folderPermissionIds
    }
    
    // Files
    folder.files.forEach(file => {
      allFiles[file.id] = {
        id: file.id,
        folderId: file.folderId,
        userId: file.userId,
        name: file.name,
        type: file.type,
        typeId: file.typeId,
        isPreventedFromSelecting: false
      }
    })
    
    // Permissions
    folder.permissions.forEach(folderPermission => {
      allFolderPermissions[folderPermission.id] = folderPermission
    })
    
    // Subfolders
    folder.folders.forEach(currentFolder => getFolderAndFilesFromFolder(currentFolder, folderPermissions))
  }
  
  // Get the folders and files for each of the root folders
  initialFolderData.forEach(currentFolder => getFolderAndFilesFromFolder(currentFolder, null))
  
  // Get the user files
  initialFileData.forEach(currentFile => {
    allFiles[currentFile.id] = { 
      ...currentFile,
      isPreventedFromSelecting: false
    }
  })
  
  // Return the normalized objects
  return { allFolderPermissions, allFolders, allFiles, rootFolderIds, userFolderIds }
}

// Get the normalized folders and files
const { allFolderPermissions, allFolders, allFiles, rootFolderIds } = setNormalizedFoldersAndFiles()

// Initial Folder State
export const initialFolderState: IFolderState = {
  activeFolderPath: [initialFolderData[0].id],
  clipboard: { 
    itemId: null, 
    cutOrCopy: null, 
    folderOrFile: null 
  },
  allFolderPermissions: allFolderPermissions,
	allFolders: allFolders,
  allFiles: allFiles,
	rootFolderIds: rootFolderIds,
}
export type IFolderState = {
  activeFolderPath: IFolder['id'][]
  clipboard: IFolderClipboard
	allFolderPermissions: IAllFolderPermissions
	allFolders: IAllFolders
  allFiles: IAllFiles
	rootFolderIds: IFolder['id'][]
	userFileIds: IFile['id'][]
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
        allFiles: {
          ...state.allFiles,
          [newFile.id]: newFile
        },
        allFolders: {
          ...state.allFolders,
          [folderId]: {
            ...state.allFolders[folderId],
            files: [ ...state.allFolders[folderId].files, newFile.id ]
          }
        }
      }
    }

		case CREATE_FOLDER: {
      const { folderId, newFolder, newFolderId } = action
			return {
				...state,
				allFolders: {
					...state.allFolders,
					[folderId]: {
						...state.allFolders[folderId],
						folders: [ ...state.allFolders[folderId].folders, newFolderId],
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
				allFolders: {
					...state.allFolders,
					[id]: {
						...state.allFolders[id],
						...updates,
					},
				},
			}
		}

		case UPDATE_FILE: {
			const { id, updates } = action
			return {
				...state,
				allFiles: {
					...state.allFiles,
					[id]: {
						...state.allFiles[id],
						...updates,
					},
				},
			}
		}

		case UPDATE_FILES: {
      const { nextFiles } = action
			return {
				...state,
        allFiles: nextFiles
			}
		}

		case UPDATE_FOLDERS: {
      const { nextFolders } = action
			return {
				...state,
        allFolders: nextFolders
			}
		}

		default:
			return state
	}
}

export default folderReducer
