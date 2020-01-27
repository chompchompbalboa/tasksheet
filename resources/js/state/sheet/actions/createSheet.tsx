//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFile, IFolder } from '@/state/folder/types'
import { IUser } from '@/state/user/types'

import { 
  createFile,
  updateFile
} from '@/state/folder/actions'
import { openFileInNewTab } from '@/state/tab/actions'

//-----------------------------------------------------------------------------
// Create Sheet
//-----------------------------------------------------------------------------
export const createSheet = (folderId: IFolder['id'], newFileName?: string, openSheetAfterCreate: boolean = false, userId: IUser['id'] = null): IThunkAction => {
  return async (dispatch: IThunkDispatch) => {

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

    dispatch(createFile(folderId, userId, newFile))
    
    await mutation.createSheet(newSheetId)
    
    dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    openSheetAfterCreate && dispatch(openFileInNewTab(newFile.id))
    
  }
}