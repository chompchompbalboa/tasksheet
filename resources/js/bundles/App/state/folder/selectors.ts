//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'

import { File, Files, Folder, Folders } from './types'

//-----------------------------------------------------------------------------
// Select Active Folder Id
//-----------------------------------------------------------------------------
export const selectActiveFolderId = (state: AppState): string => state.folder.activeFolderId

//-----------------------------------------------------------------------------
// Select Active Folder Path
//-----------------------------------------------------------------------------
export const selectActiveFolderPath = (state: AppState): string[] => state.folder.activeFolderPath

//-----------------------------------------------------------------------------
// Select File
//-----------------------------------------------------------------------------
export const selectFile = (id: string, state: AppState): File => state.folder.files[id]

//-----------------------------------------------------------------------------
// Select Files
//-----------------------------------------------------------------------------
export const selectFiles = (state: AppState): Files => state.folder.files

//-----------------------------------------------------------------------------
// Select Folder
//-----------------------------------------------------------------------------
export const selectFolder = (id: string, state: AppState): Folder => state.folder.folders[id]

//-----------------------------------------------------------------------------
// Select Folders
//-----------------------------------------------------------------------------
export const selectFolders = (state: AppState): Folders => state.folder.folders

//-----------------------------------------------------------------------------
// Select Root Folders
//-----------------------------------------------------------------------------
export const selectRootFolderIds = (state: AppState): string[] => state.folder.rootFolderIds
