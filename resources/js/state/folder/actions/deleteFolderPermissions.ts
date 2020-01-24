//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFolderPermission } from '@/state/folder/types'

import {
  setAllFolders
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Delete Folder Permissions
//-----------------------------------------------------------------------------
export const deleteFolderPermissions = (folderPermissionIdsToDelete: IFolderPermission['id'][]): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      allFolderPermissions,
      allFolders
    } = getState().folder
    
    let nextAllFolders = { ...allFolders }
    
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
    
    dispatch(setAllFolders(nextAllFolders))
  }
}