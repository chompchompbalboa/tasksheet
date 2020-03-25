//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@/state/initialData'
import { 
  IAllFiles, IFile,
  IAllFolders, IFolder,
  IAllFolderPermissions, 
  IAllFilePermissions, 
  IAllUserFilePermissionsByFileTypeId,
  IFolderClipboard, 
} from '@/state/folder/types'
import {
  IFolderActions,
  SET_ALL_FOLDER_PERMISSIONS, UPDATE_FOLDER_PERMISSION,
  SET_ALL_FILE_PERMISSIONS, UPDATE_FILE_PERMISSION,
  SET_ALL_FOLDERS, UPDATE_FOLDER,
  SET_ALL_FILES, UPDATE_FILE,
  SET_ALL_USER_FILE_PERMISSIONS_BY_TYPE_ID,
  UPDATE_ACTIVE_FILE_ID,
  UPDATE_ACTIVE_FOLDER_PATH,
  UPDATE_CLIPBOARD,
  UPDATE_USER_FILE_IDS
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Initial  
//-----------------------------------------------------------------------------
const initialFolderData = typeof initialData !== 'undefined' ? initialData.folders : defaultInitialData.folders
const initialFileData = typeof initialData !== 'undefined' ? initialData.files : defaultInitialData.files
const initialUserData = typeof initialData !== 'undefined' ? initialData.user : defaultInitialData.user

// Function to set the normalized folders and files
const setNormalizedFoldersAndFiles = () => {
  
  // Variables
  const allFolderPermissions: IAllFolderPermissions = {}
  const allFilePermissions: IAllFilePermissions = {}
  const allUserFilePermissionsByFileTypeId: IAllUserFilePermissionsByFileTypeId = {}
  const allFolders: IAllFolders = {}
  const allFiles: IAllFiles = {}
  const allFolderIds = new Set( initialFolderData.map(folder => folder.id) )
  const folderFolders: { [folderId: string]: IFolder['id'][] } = {}
  const folderFiles: { [folderId: string]: IFile['id'][] } = {}
  const userFolderIds = initialFolderData.map(folder => 
    (folder.folderId === null || !allFolderIds.has(folder.folderId)) 
    ? folder.id 
    : undefined
  ).filter(Boolean)
  const userFileIds = initialFileData.map(file => 
    (file.folderId === null || !allFolderIds.has(file.folderId)) 
    ? file.id 
    : undefined
  ).filter(Boolean)

  // Set the child folder ids for each folder
  initialFolderData.forEach(folder => {
    if(folder.folderId) {
      folderFolders[folder.folderId] = [ ...folderFolders[folder.folderId] || [], folder.id ]
    }
  })
  
  // Set the file ids for each folder and add files to allFiles
  initialFileData.forEach(file => {
    const filePermissionIds = file.permissions.map(filePermission => filePermission.id)
    if(file.folderId) {
      folderFiles[file.folderId] = [ ...folderFiles[file.folderId] || [], file.id ]
    }
    allFiles[file.id] = {
      ...file,
      permissions: filePermissionIds
    }
    file.permissions.forEach(filePermission => {
      allFilePermissions[filePermission.id] = filePermission
      if(filePermission.userId === initialUserData.id) {
        allUserFilePermissionsByFileTypeId[file.typeId] = filePermission.id
      }
    })
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
      role: folder.role,
      permissions: folderPermissionIds
    }
    folder.permissions.forEach(folderPermission => {
      allFolderPermissions[folderPermission.id] = folderPermission
    })
  })
  
  // Return the normalized objects
  return { 
    allFolderPermissions, 
    allFilePermissions, 
    allFolders, 
    allFiles,
    allUserFilePermissionsByFileTypeId,
    userFolderIds, 
    userFileIds 
  }
}

// Get the normalized folders and files
const { 
  allFolderPermissions, 
  allFilePermissions, 
  allFolders, 
  allFiles,
  allUserFilePermissionsByFileTypeId,
  userFolderIds, 
  userFileIds 
} = setNormalizedFoldersAndFiles()

// Initial Folder State
export const initialFolderState: IFolderState = {
  activeFileId: null,
  activeFolderPath: [ userFolderIds[0] ],
  allFolderPermissions: allFolderPermissions,
  allFilePermissions: allFilePermissions,
	allFolders: allFolders,
  allFiles: allFiles,
  allUserFilePermissionsByFileTypeId: allUserFilePermissionsByFileTypeId,
  userFolderIds: userFolderIds,
  userFileIds: userFileIds,
  clipboard: { 
    itemId: null, 
    cutOrCopy: null, 
    folderOrFile: null 
  }
}
export type IFolderState = {
  activeFileId: IFile['id']
  activeFolderPath: IFolder['id'][]
	allFolderPermissions: IAllFolderPermissions
	allFilePermissions: IAllFilePermissions
	allFolders: IAllFolders
  allFiles: IAllFiles
  allUserFilePermissionsByFileTypeId: IAllUserFilePermissionsByFileTypeId
	userFolderIds: IFolder['id'][]
	userFileIds: IFile['id'][]
  clipboard: IFolderClipboard
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const folderReducer = (state = initialFolderState, action: IFolderActions): IFolderState => {
	switch (action.type) {
      
		case SET_ALL_FOLDER_PERMISSIONS: { return { ...state, allFolderPermissions: action.nextAllFolderPermissions } }
		case SET_ALL_FILE_PERMISSIONS: { return { ...state, allFilePermissions: action.nextAllFilePermissions } }
		case SET_ALL_FOLDERS: { return { ...state, allFolders: action.nextAllFolders } }
		case SET_ALL_FILES: { return { ...state, allFiles: action.nextAllFiles } }
		case SET_ALL_USER_FILE_PERMISSIONS_BY_TYPE_ID: { return { ...state, allUserFilePermissionsByFileTypeId: action.nextAllUserFilePermissionsByFileTypeId } }
      
		case UPDATE_ACTIVE_FILE_ID: {
      const { nextActiveFileId, nextActiveFolderPath } = action
			return {
				...state,
				activeFileId: nextActiveFileId,
        activeFolderPath: nextActiveFolderPath
			}
		}
      
		case UPDATE_ACTIVE_FOLDER_PATH: {
      const { nextActiveFolderPath } = action
			return {
				...state,
        activeFileId: null,
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
		case UPDATE_FILE_PERMISSION: {
      const { filePermissionId, updates } = action
			return {
        ...state,
        allFilePermissions: {
          ...state.allFilePermissions,
          [filePermissionId]: {
            ...state.allFilePermissions[filePermissionId],
            ...updates
          }
        }
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
