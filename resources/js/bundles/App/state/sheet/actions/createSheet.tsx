//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@app/api'

import { IThunkAction, IThunkDispatch } from '@app/state/types'
import { IFile, IFolder } from '@app/state/folder/types'

import { createFile, updateFile } from '@app/state/folder/actions'

//-----------------------------------------------------------------------------
// Create Sheet
//-----------------------------------------------------------------------------
export const createSheet = (folderId: IFolder['id']): IThunkAction => {
  return async (dispatch: IThunkDispatch) => {

    const newSheetId = createUuid()

    const newFile: IFile = {
      id: createUuid(),
      folderId: folderId,
      name: null,
      type: 'SHEET',
      typeId: newSheetId,
      isPreventedFromSelecting: true
    }

    dispatch(createFile(folderId, newFile))
    
    mutation.createSheet(newSheetId).then(() => {
      dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
    })
    
  }
}