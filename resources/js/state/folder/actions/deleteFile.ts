//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import clone from '@/utils/clone'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'

import {
  updateFolder,
  updateUserFileIds
} from '@/state/folder/actions'
import { createHistoryStep } from '@/state/history/actions'
import { closeTab } from '@/state/tab/actions'

//-----------------------------------------------------------------------------
// Delete File
//-----------------------------------------------------------------------------
export const deleteFile = (fileId: string) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      folder: {
        allFiles,
        allFolders,
        userFileIds
      },
      tab: {
        tabs
      }
    } = getState()
    const file = allFiles[fileId]
    if(file) {
      if(file.folderId) {
        const folder = allFolders[file.folderId]
        const folderFiles = clone(folder.files)
        const nextFolderFiles = folder.files.filter(folderFileId => folderFileId !== fileId)
        const actions = () => {
          batch(() => {
            if(tabs.includes(fileId)) {
              dispatch(closeTab(fileId))
            }
            dispatch(updateFolder(folder.id, { files: nextFolderFiles }, true))
          })
          mutation.deleteFile(fileId)
        }
        const undoActions = () => {
          dispatch(updateFolder(folder.id, { files: folderFiles }, true))
          mutation.restoreFile(fileId)
        }
        dispatch(createHistoryStep({actions, undoActions}))
        actions()
      }
      if(file.userId) {
        const actions = () => {
          batch(() => {
            if(tabs.includes(fileId)) {
              dispatch(closeTab(fileId))
            }
            dispatch(updateUserFileIds(userFileIds.filter(currentFileId => fileId !== currentFileId)))
          })
          mutation.deleteFile(fileId)
        }
        const undoActions = () => {
          dispatch(updateUserFileIds(userFileIds))
          mutation.restoreFile(fileId)
        }
        dispatch(createHistoryStep({actions, undoActions}))
        actions()
      }
    }
	}
}