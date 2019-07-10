//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type TabActions = CloseTab | OpenFile | OpenFileInNewTab | UpdateActiveTabId

//-----------------------------------------------------------------------------
// Close Tab
//-----------------------------------------------------------------------------
export const CLOSE_TAB = 'CLOSE_TAB'
interface CloseTab {
	type: typeof CLOSE_TAB
	fileId: string
}

export const closeTab = (fileId: string): TabActions => {
	return {
		type: CLOSE_TAB,
		fileId: fileId,
	}
}

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

//-----------------------------------------------------------------------------
// Update Active Tab
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_TAB_ID = 'UPDATE_ACTIVE_TAB_ID'
interface UpdateActiveTabId {
	type: typeof UPDATE_ACTIVE_TAB_ID
	nextActiveTabId: string
}

export const updateActiveTabId = (nextActiveTabId: string): TabActions => {
	return {
		type: UPDATE_ACTIVE_TAB_ID,
		nextActiveTabId: nextActiveTabId,
	}
}
