export interface Folders {
	[key: string]: Folder
}

export interface Files {
	[key: string]: File
}

export interface Folder {
  id: string
  folderId?: string
	name: string
	folders: string[]
	files: string[]
}
export type FolderUpdates = {
  folderId?: string
  name?: string
  files?: string[]
  folders?: string[]
}

export interface File {
	id: string
  folderId: string
	name: string
	type: FileType
  typeId: string
  isPreventedFromSelecting?: boolean
}
export type FileUpdates = {
  folderId?: string
  name?: string
  type?: FileType
  isPreventedFromSelecting?: boolean
}

export type FileType = 'SHEET' | 'SHEET_VIEW'

export interface Clipboard {
  itemId: string
  cutOrCopy: 'CUT' | 'COPY'
  folderOrFile: 'FOLDER' | 'FILE'
}
export type ClipboardUpdates = {
  itemId?: string
  cutOrCopy?: 'CUT' | 'COPY'
  folderOrFile?: 'FOLDER' | 'FILE'
}
