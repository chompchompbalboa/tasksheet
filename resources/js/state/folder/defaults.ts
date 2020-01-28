//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { v4 as createUuid } from 'uuid'

import { IFolder } from '@/state/folder/types'

//-----------------------------------------------------------------------------
// Default Folder
//-----------------------------------------------------------------------------
export const defaultFolder = (folderId: IFolder['id']): IFolder => {
  return {
    id: createUuid(),
    folderId: folderId,
    name: null,
    role: 'OWNER',
    files: [],
    folders: [],
    permissions: []
  }
}