//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'

import {
  updateActiveFolderPath,
  updateFolder,
  updateUserFolderIds
} from '@/state/folder/actions'
import { createHistoryStep } from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Delete Folder
//-----------------------------------------------------------------------------
export const deleteFolder = (folderId: string) => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      folder: {
        activeFolderPath,
        allFolders,
        userFolderIds
      }
    } = getState()

    const folder = allFolders[folderId]

    if(folder) {

      // Remove the folder from the active folder path if needed
      const activeFolderPathIndex = activeFolderPath.indexOf(folderId)
      if(activeFolderPathIndex !== -1) {
        if(activeFolderPathIndex === 0) {
          dispatch(updateActiveFolderPath(0, userFolderIds[0]))
        }
        else {
          const nextActiveFolderId = activeFolderPath[Math.max(0, activeFolderPathIndex - 1)]
          dispatch(updateActiveFolderPath(Math.max(0, activeFolderPathIndex - 1), nextActiveFolderId))
        }
      }

      // Get the parent folder
      const parentFolder = allFolders[folder.folderId]

      // Delete the folder
      if(parentFolder) {
        const nextParentFolderFolders = parentFolder.folders.filter(currentFolderId => currentFolderId !== folderId)
        const actions = () => {
          dispatch(updateFolder(parentFolder.id, { folders: nextParentFolderFolders }, true))
          mutation.deleteFolder(folderId)
        }
        const undoActions = () => {
          dispatch(updateFolder(parentFolder.id, { folders: parentFolder.folders }, true))
          mutation.restoreFolder(folderId)
        }
        dispatch(createHistoryStep({actions, undoActions}))
        actions()
      }
      else {
        const nextUserFolderIds = userFolderIds.filter(currentFolderId => currentFolderId !== folderId)
        const actions = () => {
          dispatch(updateUserFolderIds(nextUserFolderIds))
          mutation.deleteFolder(folderId)
        }
        const undoActions = () => {
          dispatch(updateUserFolderIds(userFolderIds))
          mutation.restoreFolder(folderId)
        }
        dispatch(createHistoryStep({actions, undoActions}))
        actions()
      }
    }
	}
}