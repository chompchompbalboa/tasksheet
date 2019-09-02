//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { ThunkAction, ThunkDispatch } from '@app/state/types'
import { updateUserActive } from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type TabActions = CloseTab | OpenFile | OpenFileInNewTab | UpdateActiveTab | UpdateTabs

//-----------------------------------------------------------------------------
// Close Tab
//-----------------------------------------------------------------------------
export const CLOSE_TAB = 'CLOSE_TAB'
interface CloseTab {
	type: typeof CLOSE_TAB
	fileId: string
}

export const closeTab = (fileId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
		dispatch(closeTabReducer(fileId))
    const {
      activeTab,
      tabs
    } = getState().tab
		dispatch(updateUserActive({ tabId: activeTab, tabs: tabs }))
	}
}

const closeTabReducer = (fileId: string): TabActions => {
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

export const openFile = (fileId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
		dispatch(openFileReducer(fileId))
		const tab = getState().tab
		dispatch(updateUserActive({ tabId: tab.activeTab, tabs: tab.tabs }))
	}
}

const openFileReducer = (fileId: string): TabActions => {
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

export const openFileInNewTab = (fileId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
		const files = getState().folder.files
		if (Object.keys(files).includes(fileId)) { 
      dispatch(openFileInNewTabReducer(fileId)) 
      const tab = getState().tab
      dispatch(updateUserActive({ tabId: tab.activeTab, tabs: tab.tabs }))
    }
	}
}

const openFileInNewTabReducer = (fileId: string): TabActions => {
	return {
		type: OPEN_FILE_IN_NEW_TAB,
		fileId: fileId,
	}
}

//-----------------------------------------------------------------------------
// Update Active Tab
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_TAB = 'UPDATE_ACTIVE_TAB'
interface UpdateActiveTab {
	type: typeof UPDATE_ACTIVE_TAB
	nextActiveTab: string
}

export const updateActiveTab = (nextActiveTab: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
		dispatch(updateActiveTabReducer(nextActiveTab))
		const tab = getState().tab
		dispatch(updateUserActive({ tabId: tab.activeTab, tabs: tab.tabs }))
	}
}

const updateActiveTabReducer = (nextActiveTab: string): TabActions => {
	return {
		type: UPDATE_ACTIVE_TAB,
		nextActiveTab: nextActiveTab,
	}
}

//-----------------------------------------------------------------------------
// Update Active Tab
//-----------------------------------------------------------------------------
export const UPDATE_TABS = 'UPDATE_TABS'
interface UpdateTabs {
  type: typeof UPDATE_TABS
  nextTabs: string[]
}

export const updateTabs = (nextTabs: string[]): TabActions => {
	return {
		type: UPDATE_TABS,
		nextTabs: nextTabs,
	}
}
