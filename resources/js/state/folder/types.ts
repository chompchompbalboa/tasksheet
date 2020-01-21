export interface IFolders {
	[key: string]: IFolder
}

export interface IFiles {
	[key: string]: IFile
}

export interface IFolderFromDatabase {
  id: string
  folderId?: string
	name: string
	folders: IFolderFromDatabase[]
	files: IFile[]
  users: IFolderUser[]
}

export interface IFolder {
  id: string
  folderId?: string
	name: string
	folders: IFolder['id'][]
	files: IFile['id'][]
  users: IFolderUser[]
}

export interface IFolderUpdates {
  folderId?: string
  name?: string
  files?: string[]
  folders?: string[]
}

export interface IFolderUser {
  id: string
  name: string
  email: string
  role: string
}

export interface IFile {
	id: string
  folderId: string
	name: string
	type: IFileType
  typeId: string
  isPreventedFromSelecting?: boolean
}
export interface IFileUpdates {
  folderId?: string
  name?: string
  type?: IFileType
  isPreventedFromSelecting?: boolean
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
