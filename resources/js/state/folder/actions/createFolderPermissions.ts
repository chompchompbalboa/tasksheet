//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFolderPermission, IFilePermission } from '@/state/folder/types'

import {
  setAllFolderPermissions,
  setAllFolders,
  setAllFilePermissions,
  setAllFiles
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Create Folder Permission
//-----------------------------------------------------------------------------
export const createFolderPermissions = (
  newFolderPermissions: IFolderPermission[], 
  newFilePermissions: IFilePermission[]
): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFolderPermissions,
      allFolders,
      allFilePermissions,
      allFiles
    } = getState().folder
    
    let nextAllFolderPermissions = { ...allFolderPermissions }
    let nextAllFolders = { ...allFolders }
    let nextAllFilePermissions = { ...allFilePermissions }
    let nextAllFiles = { ...allFiles }
    
    newFolderPermissions && newFolderPermissions.forEach(newFolderPermission => {
      const folder = nextAllFolders[newFolderPermission.folderId]
      const nextFolderPermissions = [
        ...folder.permissions,
        newFolderPermission.id
      ]
      nextAllFolderPermissions = {
        ...nextAllFolderPermissions,
        [newFolderPermission.id]: newFolderPermission
      }
      nextAllFolders = {
        ...nextAllFolders,
        [folder.id]: {
          ...nextAllFolders[folder.id],
          permissions: nextFolderPermissions
        }
      }
    })

    newFilePermissions && newFilePermissions.forEach(newFilePermission => {
      const file = nextAllFiles[newFilePermission.fileId]
      const nextFilePermissions = [
        ...file.permissions,
        newFilePermission.id
      ]
      nextAllFilePermissions = {
        ...nextAllFilePermissions,
        [newFilePermission.id]: newFilePermission
      }
      nextAllFiles = {
        ...nextAllFiles,
        [file.id]: {
          ...nextAllFiles[file.id],
          permissions: nextFilePermissions
        }
      }
    })
    
    dispatch(setAllFolderPermissions(nextAllFolderPermissions))
    dispatch(setAllFilePermissions(nextAllFilePermissions))
    dispatch(setAllFolders(nextAllFolders))
    dispatch(setAllFiles(nextAllFiles))
  }
}