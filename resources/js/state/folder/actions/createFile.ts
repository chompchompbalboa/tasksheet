//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'
import { IFolder, IFile } from '@/state/folder/types'
import { IUser } from '@/state/user/types'

import { 
  setAllFolders,
  setAllFiles,
  updateUserFileIds
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Action
//-----------------------------------------------------------------------------
export const createFile = (folderId: IFolder['id'] = null, userId: IUser['id'] = null, newFile: IFile) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allFolders,
      allFiles,
      userFileIds
    } = getState().folder

    const nextAllFiles = { 
      ...allFiles,
      [newFile.id]: newFile
    }
    dispatch(setAllFiles(nextAllFiles))

    if(folderId) {
      dispatch(setAllFolders({
        ...allFolders,
        [folderId]: {
          ...allFolders[folderId],
          files: [ ...allFolders[folderId].files, newFile.id ]
        }
      }))
    }
    
    if(userId) {
      dispatch(updateUserFileIds([
        ...userFileIds,
        newFile.id
      ]))
    }

    mutation.createFile(newFile)
	}
}