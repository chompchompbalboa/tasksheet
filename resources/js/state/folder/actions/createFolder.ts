//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'
import { IAllFolders, IFolder, IFolderPermission } from '@/state/folder/types'

import { 
  createFolderPermissions,
  setAllFolders,
  updateUserFolderIds
} from '@/state/folder/actions'
import { defaultFolder } from '@/state/folder/defaults'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const createFolder = (parentFolderId: IFolder['id']) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allFolders,
      userFolderIds
    } = getState().folder

    const newFolder = defaultFolder(parentFolderId)

    let nextAllFolders: IAllFolders = null
    if(parentFolderId !== null) {
      nextAllFolders = {
        ...allFolders,
        [parentFolderId]: {
          ...allFolders[parentFolderId],
          folders: [ ...allFolders[parentFolderId].folders, newFolder.id],
        },
        [newFolder.id]: newFolder
      }
    }
    else {
      nextAllFolders = {
        ...allFolders,
        [newFolder.id]: newFolder
      }
      dispatch(updateUserFolderIds([ ...userFolderIds, newFolder.id ]))
    }

    dispatch(setAllFolders(nextAllFolders))
    mutation.createFolder(newFolder)
      .then(response => {
        dispatch(createFolderPermissions(response.data as IFolderPermission[], null))
      })
	}
}