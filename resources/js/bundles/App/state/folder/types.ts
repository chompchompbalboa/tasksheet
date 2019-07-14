export interface Folders {
	[key: string]: Folder
}

export interface Files {
	[key: string]: File
}

export interface Folder {
	id: string
	name: string
	folders: keyof Folders[]
	files: keyof File[]
}

export interface File {
	id: string
	name: string
	type: FileType
	typeId: string
}

export enum FileType {
	SHEET = 'SHEET',
}
