//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type TabActions = OpenFile | OpenFileInNewTab

//-----------------------------------------------------------------------------
// Open File
//-----------------------------------------------------------------------------
export const OPEN_FILE = 'OPEN_FILE'
interface OpenFile {
	type: typeof OPEN_FILE
	fileId: string
}

export const openFile = (fileId: string): TabActions => {
	return {
		type: OPEN_FILE,
		fileId: fileId,
	}
}

//-----------------------------------------------------------------------------
// Open File In New Tab
//-----------------------------------------------------------------------------
export const OPEN_FILE_IN_NEW_TAB = 'OPEN_FILE_IN_NEW_TAB'
interface OpenFileInNewTab {
	type: typeof OPEN_FILE_IN_NEW_TAB
	fileId: string
}

export const openFileInNewTab = (fileId: string): TabActions => {
	return {
		type: OPEN_FILE_IN_NEW_TAB,
		fileId: fileId,
	}
}
