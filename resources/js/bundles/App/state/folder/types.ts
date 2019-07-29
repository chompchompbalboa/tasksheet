export interface Folders {
	[key: string]: Folder
}

export interface Files {
	[key: string]: File
}

export interface Folder {
	id: string
	name: string
	folders: string[]
	files: string[]
}

export interface File {
	id: string
  folderId: string
	name: string
	type: FileType
	typeId: string
}

export type FileType = 'SHEET' | 'SHEET_VIEW'
