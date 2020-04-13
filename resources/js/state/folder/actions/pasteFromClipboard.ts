//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkDispatch } from '@/state/types'

import { 
  updateFile,
  updateFolder,
  updateUserFileIds
} from '@/state/folder/actions'

//-----------------------------------------------------------------------------
// Paste From Clipboard
//-----------------------------------------------------------------------------
export const pasteFromClipboard = (nextFolderId: string) => {
  return (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      clipboard: {
        itemId,
        cutOrCopy,
        folderOrFile
      },
      allFiles,
      allFolders,
      userFileIds
    } = getState().folder
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
        dispatch(updateFolder(previousFolder.id, {
          folders: previousFolder.folders.filter(folderId => folderId !== folder.id) 
        }, true))
      }
    }
  }
}