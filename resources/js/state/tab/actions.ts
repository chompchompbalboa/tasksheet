//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@/state'
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { updateUserActive } from '@/state/user/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type ITabActions = 
  ICloseTab | 
  IOpenFile | IOpenFileInNewTab | 
  IUpdateActiveTab | 
  IUpdateTabs

//-----------------------------------------------------------------------------
// Close Tab
//-----------------------------------------------------------------------------
export const CLOSE_TAB = 'CLOSE_TAB'
interface ICloseTab {
	type: typeof CLOSE_TAB
	fileId: string
}

export const closeTab = (fileId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
		dispatch(closeTabReducer(fileId))
    const {
      activeTab,
      tabs
    } = getState().tab
		dispatch(updateUserActive({ tab: activeTab, tabs: tabs }))
	}
}

const closeTabReducer = (fileId: string): ITabActions => {
	return {
		type: CLOSE_TAB,
		fileId: fileId,
	}
}

//-----------------------------------------------------------------------------
// Open File
//-----------------------------------------------------------------------------
export const OPEN_FILE = 'OPEN_FILE'
interface IOpenFile {
	type: typeof OPEN_FILE
	fileId: string
}

export const openFile = (fileId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
		dispatch(openFileReducer(fileId))
		const tab = getState().tab
		dispatch(updateUserActive({ tab: tab.activeTab, tabs: tab.tabs }))
	}
}

const openFileReducer = (fileId: string): ITabActions => {
	return {
		type: OPEN_FILE,
		fileId: fileId,
	}
}

//-----------------------------------------------------------------------------
// Open File In New Tab
//-----------------------------------------------------------------------------
export const OPEN_FILE_IN_NEW_TAB = 'OPEN_FILE_IN_NEW_TAB'
interface IOpenFileInNewTab {
	type: typeof OPEN_FILE_IN_NEW_TAB
	fileId: string
}

export const openFileInNewTab = (fileId: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
		const allFiles = getState().folder.allFiles
		if (Object.keys(allFiles).includes(fileId)) { 
      dispatch(openFileInNewTabReducer(fileId)) 
      const tab = getState().tab
      dispatch(updateUserActive({ tab: tab.activeTab, tabs: tab.tabs }))
    }
	}
}

const openFileInNewTabReducer = (fileId: string): ITabActions => {
	return {
		type: OPEN_FILE_IN_NEW_TAB,
		fileId: fileId,
	}
}

//-----------------------------------------------------------------------------
// Update Active Tab
//-----------------------------------------------------------------------------
export const UPDATE_ACTIVE_TAB = 'UPDATE_ACTIVE_TAB'
interface IUpdateActiveTab {
	type: typeof UPDATE_ACTIVE_TAB
	nextActiveTab: string
}

export const updateActiveTab = (nextActiveTab: string): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
		dispatch(updateActiveTabReducer(nextActiveTab))
    const tab = getState().tab
    if(![ 'FOLDERS', 'HELP', 'SETTINGS' ].includes(tab.activeTab)) {
      dispatch(updateUserActive({ tab: tab.activeTab, tabs: tab.tabs }))
    }
	}
}

const updateActiveTabReducer = (nextActiveTab: string): ITabActions => {
	return {
		type: UPDATE_ACTIVE_TAB,
		nextActiveTab: nextActiveTab,
	}
}

//-----------------------------------------------------------------------------
// Update Active Tab
//-----------------------------------------------------------------------------
export const UPDATE_TABS = 'UPDATE_TABS'
interface IUpdateTabs {
  type: typeof UPDATE_TABS
  nextTabs: string[]
}

export const updateTabs = (nextTabs: string[]): ITabActions => {
	return {
		type: UPDATE_TABS,
		nextTabs: nextTabs,
	}
}
