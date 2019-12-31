//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'

import { 
  IFile, IFiles, 
  IFolder, IFolders 
} from './types'

//-----------------------------------------------------------------------------
// Select Active Folder Path
//-----------------------------------------------------------------------------
export const selectActiveFolderPath = (state: IAppState): string[] => state.folder.activeFolderPath

//-----------------------------------------------------------------------------
// Select File
//-----------------------------------------------------------------------------
export const selectFile = (id: string, state: IAppState): IFile => state.folder.files && state.folder.files[id]

//-----------------------------------------------------------------------------
// Select Files
//-----------------------------------------------------------------------------
export const selectFiles = (state: IAppState): IFiles => state.folder.files

//-----------------------------------------------------------------------------
// Select Folder
//-----------------------------------------------------------------------------
export const selectFolder = (id: string, state: IAppState): IFolder => state.folder.folders && state.folder.folders[id]

//-----------------------------------------------------------------------------
// Select Folders
//-----------------------------------------------------------------------------
export const selectFolders = (state: IAppState): IFolders => state.folder.folders

//-----------------------------------------------------------------------------
// Select Is Saving New File
//-----------------------------------------------------------------------------
export const selectIsSavingNewFile = (state: IAppState): boolean => state.folder.isSavingNewFile

//-----------------------------------------------------------------------------
// Select On File Save
//-----------------------------------------------------------------------------
export const selectOnFileSave = (state: IAppState): () => void => state.folder.onFileSave

//-----------------------------------------------------------------------------
// Select Root Folders
//-----------------------------------------------------------------------------
export const selectRootFolderIds = (state: IAppState): string[] => state.folder.rootFolderIds
