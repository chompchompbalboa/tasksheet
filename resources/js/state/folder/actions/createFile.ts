//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'
import { IFolder, IFile } from '@/state/folder/types'

import { 
  setAllFolders,
  setAllFiles 
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const createFile = (folderId: IFolder['id'], newFile: IFile) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allFolders,
      allFiles
    } = getState().folder

    const nextAllFolders = {
      ...allFolders,
      [folderId]: {
        ...allFolders[folderId],
        files: [ ...allFolders[folderId].files, newFile.id ]
      }
    }

    const nextAllFiles = { 
      ...allFiles,
      [newFile.id]: newFile
    }

    dispatch(setAllFiles(nextAllFiles))
    dispatch(setAllFolders(nextAllFolders))

    mutation.createFile(newFile)
	}
}