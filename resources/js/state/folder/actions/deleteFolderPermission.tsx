//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFolder, IFolderPermission } from '@/state/folder/types'

import {
  updateFolder
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Delete Folder Permission
//-----------------------------------------------------------------------------
export const deleteFolderPermission = (folderId: IFolder['id'], folderPermissionId: IFolderPermission['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFolders
    } = getState().folder
    
    const folder = allFolders[folderId]
    
    const nextFolderPermissions = folder.permissions.filter(currentFolderPermissionId => folderPermissionId !== currentFolderPermissionId)
    
    dispatch(updateFolder(folderId, { permissions: nextFolderPermissions }, true))
  }
}