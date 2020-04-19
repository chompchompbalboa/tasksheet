//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'

import { 
  updateFile,
  updateFolder,
  updateUserFileIds,
  updateUserFolderIds
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Paste From Clipboard
//-----------------------------------------------------------------------------
export const pasteFromClipboard = (nextFolderId: string) => {
  return (dispatch: IThunkDispatch, getState: () => IAppState) => {

    const {
      folder: {
        clipboard: {
          itemId,
          cutOrCopy,
          folderOrFile
        },
        allFiles,
        allFolders,
        userFileIds,
        userFolderIds
      },
      user: {
        id: userId
      }
    } = getState()

    // If we are pasting into a folder
    if(nextFolderId !== null) {
      
      // Get the next folder
      const nextFolder = allFolders[nextFolderId]
  
      // File
      if(folderOrFile === 'FILE') {
        const file = allFiles[itemId]
        const previousFolder = allFolders[file.folderId]
        // Cut
        if(cutOrCopy === 'CUT') {
          dispatch(updateFile(file.id, {
            folderId: nextFolderId,
            userId: null
          }))
          dispatch(updateFolder(nextFolderId, {
            files: [ ...nextFolder.files.filter(fileId => fileId !== file.id), file.id ]
          }, true))
          if(previousFolder) {
            dispatch(updateFolder(previousFolder.id, {
              files: previousFolder.files.filter(fileId => fileId !== file.id) 
            }, true))
          }
          else if (file.userId) {
            dispatch(updateUserFileIds(userFileIds.filter(fileId => fileId !== file.id)))
          }
        }
      }

      // Folder
      else if(folderOrFile === 'FOLDER') {
        const folder = allFolders[itemId]
        const previousFolder = allFolders[folder.folderId]
        // Cut
        if(cutOrCopy === 'CUT') {
          dispatch(updateFolder(folder.id, {
            folderId: nextFolder.id
          }))
          dispatch(updateFolder(nextFolder.id, {
            folders: [ ...nextFolder.folders, folder.id ]
          }, true))
          if(previousFolder) {
            dispatch(updateFolder(previousFolder.id, {
              folders: previousFolder.folders.filter(folderId => folderId !== folder.id) 
            }, true))
          }
          else {
            dispatch(updateUserFolderIds(userFolderIds.filter(folderId => folderId !== folder.id)))
          }
        }
      }
    }

    // If we are pasting into the user folder/file ids
    else {

      // File
      if(folderOrFile === 'FILE') {
        const file = allFiles[itemId]
        const previousFolder = allFolders[file.folderId]
        if(previousFolder && cutOrCopy === 'CUT') {
          dispatch(updateFile(file.id, {
            folderId: null,
            userId: userId
          }))
          dispatch(updateFolder(previousFolder.id, {
            files: previousFolder.files.filter(fileId => fileId !== file.id) 
          }, true))
          dispatch(updateUserFileIds([ ...userFileIds, file.id ]))
        }
      }

      // Folder
      else if (folderOrFile === 'FOLDER') {
        const folder = allFolders[itemId]
        const previousFolder = allFolders[folder.folderId]
        if(previousFolder && cutOrCopy === 'CUT') {
          dispatch(updateFolder(folder.id, {
            folderId: null
          }))
          dispatch(updateFolder(previousFolder.id, {
            folders: previousFolder.folders.filter(folderId => folderId !== folder.id) 
          }, true))
          dispatch(updateUserFolderIds([ ...userFolderIds, folder.id ]))
        }
      }
    }
  }
}