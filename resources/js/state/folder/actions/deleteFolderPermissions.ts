//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFolderPermission, IFilePermission } from '@/state/folder/types'

import {
  setAllFolders,
  setAllFiles
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Delete Folder Permissions
//-----------------------------------------------------------------------------
export const deleteFolderPermissions = (
  folderPermissionIdsToDelete: IFolderPermission['id'][], 
  filePermissionIdsToDelete: IFilePermission['id'][]
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFolderPermissions,
      allFolders,
      allFilePermissions,
      allFiles
    } = getState().folder
    
    let nextAllFolders = { ...allFolders }
    let nextAllFiles = { ...allFiles }
    
    folderPermissionIdsToDelete.forEach(folderPermissionId => {
      const folderPermission = allFolderPermissions[folderPermissionId]
      if(folderPermission) {
        const folder = allFolders[folderPermission.folderId]
        if(folder) {
          nextAllFolders = {
            ...nextAllFolders,
            [folder.id]: {
              ...nextAllFolders[folder.id],
              permissions: folder.permissions.filter(currentFolderPermissionId => folderPermissionId !== currentFolderPermissionId)
            }
          }
        }
      }
    })
    
    filePermissionIdsToDelete.forEach(filePermissionId => {
      const filePermission = allFilePermissions[filePermissionId]
      if(filePermission) {
        const file = allFiles[filePermission.fileId]
        if(file) {
          nextAllFiles = {
            ...nextAllFiles,
            [file.id]: {
              ...nextAllFiles[file.id],
              permissions: file.permissions.filter(currentFilePermissionId => filePermissionId !== currentFilePermissionId)
            }
          }
        }
      }
    })
    
    dispatch(setAllFolders(nextAllFolders))
    dispatch(setAllFiles(nextAllFiles))
  }
}