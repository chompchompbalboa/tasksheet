//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'
import { IFolder } from '@/state/folder/types'

import { 
  setAllFolders
} from '@/state/folder/actions'
import { defaultFolder } from '@/state/folder/defaults'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const createFolder = (parentFolderId: IFolder['id']) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allFolders
    } = getState().folder

    const newFolder = defaultFolder(parentFolderId)

    const nextAllFolders = {
      ...allFolders,
      [parentFolderId]: {
        ...allFolders[parentFolderId],
        folders: [ ...allFolders[parentFolderId].folders, newFolder.id],
      },
      [newFolder.id]: newFolder
    }

    dispatch(setAllFolders(nextAllFolders))
    mutation.createFolder(newFolder)
	}
}