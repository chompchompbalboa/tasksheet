//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IUser } from '@/state/user/types'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface IAllFolderPermissions { [folderPermissionId: string]: IFolderPermission }
export interface IAllFilePermissions { [filePermissionId: string]: IFilePermission }
export interface IAllFolders { [folderId: string]: IFolder }
export interface IAllFiles { [fileId: string]: IFile }

export interface IFolderFromDatabase {
  id: string
  folderId?: string
	name: string
  permissions: IFolderPermission[]
}

export interface IFolder {
  id: string
  folderId?: string
	name: string
	folders: IFolder['id'][]
	files: IFile['id'][]
  permissions: IFolderPermission['id'][]
}

export interface IFolderUpdates {
  folderId?: string
  name?: string
  files?: string[]
  folders?: string[]
}

export interface IFolderPermission {
  id: string
  folderId: IFolder['id']
  userId: IUser['id']
  userName: string
  userEmail: string
  role: 'OWNER' | 'ADMINISTRATOR' | 'USER'
}

export interface IFolderPermissionUpdates {
  role?: 'OWNER' | 'ADMINISTRATOR' | 'USER'
}

export interface IFileFromDatabase {
	id: string
  folderId: IFolder['id']
  userId: IUser['id']
	name: string
	type: IFileType
  typeId: string
  permissions: IFilePermission[]
  isPreventedFromSelecting?: boolean
}

export interface IFile {
	id: string
  folderId: IFolder['id']
  userId: IUser['id']
	name: string
	type: IFileType
  typeId: string
  permissions: IFilePermission['id'][]
  isPreventedFromSelecting?: boolean
}

export interface IFileUpdates {
  folderId?: string
  name?: string
  type?: IFileType
  isPreventedFromSelecting?: boolean
}

export interface IFilePermission {
  id: string
  fileId: IFile['id']
  userId: IUser['id']
  userName: string
  userEmail: string
  role: 'OWNER' | 'ADMINISTRATOR' | 'USER'
}

export interface IFilePermissionUpdates {
  role?: 'OWNER' | 'ADMINISTRATOR' | 'USER'
}

export type IFileType = 'SHEET'

export interface IFolderClipboard {
  itemId: string
  cutOrCopy: 'CUT' | 'COPY'
  folderOrFile: 'FOLDER' | 'FILE'
}

export interface IFolderClipboardUpdates {
  itemId?: string
  cutOrCopy?: 'CUT' | 'COPY'
  folderOrFile?: 'FOLDER' | 'FILE'
}
