//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IUser } from '@/state/user/types'

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export interface IAllFolderPermissions { [folderPermissionId: string]: IFolderPermission }
export interface IAllFilePermissions { [filePermissionId: string]: IFilePermission }
export interface IAllUserFilePermissionsByFileTypeId { [fileTypeId: string]: IFilePermission['id'] }
export interface IAllFolders { [folderId: string]: IFolder }
export interface IAllFiles { [fileId: string]: IFile }

export interface IFolderFromDatabase {
  id: string
  folderId?: string
	name: string
  role: IFolderPermission['role']
  permissions: IFolderPermission[]
}

export interface IFolder {
  id: string
  folderId?: string
	name: string
	folders: IFolder['id'][]
	files: IFile['id'][]
  role: IFolderPermission['role']
  permissions: IFolderPermission['id'][]
}

export interface IFolderUpdates {
  folderId?: string
  name?: string
  files?: string[]
  folders?: string[]
  permissions?: IFolderPermission['id'][]
}

export interface IFolderPermission {
  id: string
  folderId: IFolder['id']
  userId: IUser['id']
  userName: string
  userEmail: string
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
}

export interface IFolderPermissionUpdates {
  role?: IFolderPermission['role']
}

export interface IFileFromDatabase {
	id: string
  folderId: IFolder['id']
  userId: IUser['id']
	name: string
	type: IFileType
  typeId: string
  role: IFilePermission['role']
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
  role: IFilePermission['role']
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
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
}

export interface IFilePermissionUpdates {
  role?: IFilePermission['role']
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
