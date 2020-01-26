//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { IFolder } from '@/state/folder/types'

//-----------------------------------------------------------------------------
// Default Folder
//-----------------------------------------------------------------------------
export const defaultFolder = (folderId: string): IFolder => {
  return {
    id: createUuid(),
    folderId: folderId,
    name: null,
    files: [],
    folders: [],
    permissions: []
  }
}