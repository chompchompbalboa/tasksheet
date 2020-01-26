//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFile, IFolder } from '@/state/folder/types'
import { IUser } from '@/state/user/types'

import { 
  updateFile, 
  setAllFiles, 
  setAllFolders, 
  updateUserFileIds 
} from '@/state/folder/actions'
import { openFileInNewTab } from '@/state/tab/actions'

//-----------------------------------------------------------------------------
// Create Sheet
//-----------------------------------------------------------------------------
export const createSheet = (folderId: IFolder['id'], newFileName?: string, openSheetAfterCreate: boolean = false, userId: IUser['id'] = null): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      allFiles,
      allFolders,
      userFileIds
    } = getState().folder

    const newSheetId = createUuid()

    const newFile: IFile = {
      id: createUuid(),
      folderId: userId ? null : folderId,
      userId: userId,
      name: newFileName || null,
      type: 'SHEET',
      typeId: newSheetId,
      permissions: [],
      isPreventedFromSelecting: true
    }

    dispatch(setAllFiles({
      ...allFiles,
      [newFile.id]: newFile
    }))

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
    await mutation.createSheet(newSheetId)
    
    dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    openSheetAfterCreate && dispatch(openFileInNewTab(newFile.id))
    
  }
}