//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFolderPermission } from '@/state/folder/types'

import {
  setAllFolderPermissions,
  updateFolder
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Create Folder Permission
//-----------------------------------------------------------------------------
export const createFolderPermission = (newFolderPermission: IFolderPermission): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFolderPermissions,
      allFolders
    } = getState().folder
    
    const folder = allFolders[newFolderPermission.folderId]
    
    const nextAllFolderPermissions = {
      ...allFolderPermissions,
      [newFolderPermission.id]: newFolderPermission
    }
    
    const nextFolderPermissions = [
      ...folder.permissions,
      newFolderPermission.id
    ]
    
    dispatch(setAllFolderPermissions(nextAllFolderPermissions))
    dispatch(updateFolder(newFolderPermission.folderId, { permissions: nextFolderPermissions }, true))
  }
}