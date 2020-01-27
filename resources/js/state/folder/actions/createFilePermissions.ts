//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFilePermission } from '@/state/folder/types'

import {
  setAllFilePermissions,
  setAllFiles
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Create Folder Permission
//-----------------------------------------------------------------------------
export const createFilePermissions = (newFilePermissions: IFilePermission[]): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFilePermissions,
      allFiles
    } = getState().folder
    
    let nextAllFilePermissions = { ...allFilePermissions }
    let nextAllFiles = { ...allFiles }
    
    newFilePermissions.forEach(newFilePermission => {
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
    
    dispatch(setAllFilePermissions(nextAllFilePermissions))
    dispatch(setAllFiles(nextAllFiles))
  }
}