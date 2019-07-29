//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { ThunkAction, ThunkDispatch } from '@app/state/types'
import { updateUserActive } from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type TabActions = CloseTab | OpenFile | OpenFileInNewTab | UpdateActiveTabId | UpdateTabs

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
      activeTabId,
      tabs
    } = getState().tab
		dispatch(updateUserActive({ tabId: activeTabId, tabs: tabs }))
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
		dispatch(updateUserActive({ tabId: tab.activeTabId, tabs: tab.tabs }))
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
		dispatch(openFileInNewTabReducer(fileId))
		const tab = getState().tab
		dispatch(updateUserActive({ tabId: tab.activeTabId, tabs: tab.tabs }))
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
export const UPDATE_ACTIVE_TAB_ID = 'UPDATE_ACTIVE_TAB_ID'
interface UpdateActiveTabId {
	type: typeof UPDATE_ACTIVE_TAB_ID
	nextActiveTabId: string
}

export const updateActiveTabId = (nextActiveTabId: string): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
		dispatch(updateActiveTabIdReducer(nextActiveTabId))
		const tab = getState().tab
		dispatch(updateUserActive({ tabId: tab.activeTabId, tabs: tab.tabs }))
	}
}

const updateActiveTabIdReducer = (nextActiveTabId: string): TabActions => {
	return {
		type: UPDATE_ACTIVE_TAB_ID,
		nextActiveTabId: nextActiveTabId,
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
