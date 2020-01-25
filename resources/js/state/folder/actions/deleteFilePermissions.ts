//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFilePermission } from '@/state/folder/types'

import {
  setAllFiles
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Delete Folder Permissions
//-----------------------------------------------------------------------------
export const deleteFilePermissions = (filePermissionIdsToDelete: IFilePermission['id'][]): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFilePermissions,
      allFiles
    } = getState().folder
    
    let nextAllFiles = { ...allFiles }
    
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
    
    dispatch(setAllFiles(nextAllFiles))
  }
}