//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { mutation } from '@/api'

import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IFile, IFolder } from '@/state/folder/types'

import { createFile, updateFile } from '@/state/folder/actions'
import { openFileInNewTab } from '@/state/tab/actions'

//-----------------------------------------------------------------------------
// Create Sheet From Csv
//-----------------------------------------------------------------------------
export const createSheetFromCsv = (folderId: IFolder['id'], fileToUpload: File, openSheetAfterCreate: boolean = false): IThunkAction => {
  return async (dispatch: IThunkDispatch) => {

    const newSheetId = createUuid()

    const newFile: IFile = {
      id: createUuid(),
      folderId: folderId,
      userId: null,
      name: fileToUpload.name.split('.').slice(0, -1).join(''), // Name without the extension
      type: 'SHEET',
      typeId: newSheetId,
      isPreventedFromSelecting: true
    }

    dispatch(createFile(folderId, newFile))

    mutation.createSheetFromCsv(newSheetId, fileToUpload).then(() => {
      dispatch(updateFile(newFile.id, { isPreventedFromSelecting: false }, true))
      openSheetAfterCreate && dispatch(openFileInNewTab(newFile.id))
    })

  }
}