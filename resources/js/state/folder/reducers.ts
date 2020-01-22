//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@/state/initialData'
import { 
  IAllFiles, IFile,
  IAllFolders, IFolder,
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
	UPDATE_FOLDER_PERMISSION,
  UPDATE_FILE,
  UPDATE_FILES,
  UPDATE_FOLDERS,
  UPDATE_USER_FILE_IDS
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
  const folderFolders: { [folderId: string]: IFolder['id'][] } = {}
  const folderFiles: { [folderId: string]: IFile['id'][] } = {}
  const rootFolderIds = initialFolderData.map(folder => folder.folderId === null ? folder.id : undefined).filter(Boolean)
  const userFileIds = initialFileData.map(file => file.folderId === null ? file.id : undefined).filter(Boolean)
  
  // Set the child folder ids for each folder
  initialFolderData.forEach(folder => {
    if(folder.folderId) {
      folderFolders[folder.folderId] = [ ...folderFolders[folder.folderId] || [], folder.id ]
    }
  })
  
  // Set the file ids for each folder and add files to allFiles
  initialFileData.forEach(file => {
    if(file.folderId) {
      folderFiles[file.folderId] = [ ...folderFiles[file.folderId] || [], file.id ]
    }
    allFiles[file.id] = file
  })
  
  // Add the folders to allFolders and permissions to allFolderPermissions
  initialFolderData.forEach(folder => {
    const folderPermissionIds = folder.permissions.map(folderPermission => folderPermission.id)
    allFolders[folder.id] = {
      id: folder.id,
      name: folder.name,
      folderId: folder.folderId,
      folders: folderFolders[folder.id] || [],
      files: folderFiles[folder.id] || [],
      permissions: folderPermissionIds
    }
    folder.permissions.forEach(folderPermission => {
      allFolderPermissions[folderPermission.id] = folderPermission
    })
  })
  
  // Return the normalized objects
  return { allFolderPermissions, allFolders, allFiles, rootFolderIds, userFileIds }
}

// Get the normalized folders and files
const { allFolderPermissions, allFolders, allFiles, rootFolderIds, userFileIds } = setNormalizedFoldersAndFiles()

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
  userFileIds: userFileIds
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

		case UPDATE_FOLDER_PERMISSION: {
      const { folderPermissionId, updates } = action
			return {
        ...state,
        allFolderPermissions: {
          ...state.allFolderPermissions,
          [folderPermissionId]: {
            ...state.allFolderPermissions[folderPermissionId],
            ...updates
          }
        }
			}
		}

		case UPDATE_FOLDERS: {
      const { nextFolders } = action
			return {
				...state,
        allFolders: nextFolders
			}
		}

		case UPDATE_USER_FILE_IDS: {
      const { nextUserFileIds } = action
			return {
				...state,
        userFileIds: nextUserFileIds
			}
		}

		default:
			return state
	}
}

export default folderReducer
