//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFilePermission } from '@/state/folder/types'

import {
  setAllFilePermissions,
  setAllFiles,
  setAllUserFilePermissionsByFileTypeId,
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Create Folder Permission
//-----------------------------------------------------------------------------
export const createFilePermissions = (newFilePermissions: IFilePermission[]): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: {
        allFilePermissions,
        allFiles,
        allUserFilePermissionsByFileTypeId
      },
      user: {
        id: userId
      }
    } = getState()
    
    let nextAllFilePermissions = { ...allFilePermissions }
    let nextAllFiles = { ...allFiles }
    let nextAllUserFilePermissionsByFileTypeId = { ...allUserFilePermissionsByFileTypeId }
    
    newFilePermissions.forEach(newFilePermission => {
      // Get the file
      const file = nextAllFiles[newFilePermission.fileId]
      
      // Create the file permissions
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

      // Add the permissions to the user's file permissions
      if(newFilePermission.userId === userId) {
        nextAllUserFilePermissionsByFileTypeId[file.typeId] = newFilePermission.id
      }
    })
    
    dispatch(setAllFilePermissions(nextAllFilePermissions))
    dispatch(setAllFiles(nextAllFiles))
    dispatch(setAllUserFilePermissionsByFileTypeId(nextAllUserFilePermissionsByFileTypeId))
  }
}