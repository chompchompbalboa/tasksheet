//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import clone from '@/utils/clone'

import { TabActions, CLOSE_TAB, OPEN_FILE, OPEN_FILE_IN_NEW_TAB, UPDATE_ACTIVE_TAB_ID } from '@app/state/tab/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialTabState: TabState = {
	activeTabId: null,
	tabs: [],
}
export type TabState = {
	activeTabId: string
	tabs: string[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialTabState, action: TabActions): TabState => {
	switch (action.type) {
		case CLOSE_TAB: {
			const { fileId } = action
			const { activeTabId, tabs } = state
			const tabIndex = tabs.findIndex(tabId => tabId === fileId)
			const nextTabs = tabs.filter(tabFileId => tabFileId !== fileId)
			const nextActiveTabId =
				fileId === activeTabId ? (nextTabs.length > 0 ? nextTabs[(tabIndex - 1 >= 0 ? tabIndex : 0)] : null) : activeTabId
			return {
				...state,
				activeTabId: nextActiveTabId,
				tabs: nextTabs,
			}
		}

		case OPEN_FILE: {
			const { activeTabId, tabs } = state
			const { fileId } = action
			const nextTabs = clone(state.tabs)
			const activeTabIndex = tabs.findIndex(tabId => tabId === activeTabId)
			nextTabs[activeTabIndex] = fileId
			return {
				...state,
				activeTabId: fileId,
				tabs: nextTabs,
			}
		}

		case OPEN_FILE_IN_NEW_TAB: {
			const { fileId } = action
			const { tabs } = state
			if (!tabs.includes(fileId)) {
				return { ...state, activeTabId: fileId, tabs: [...state.tabs, fileId] }
			} else {
				return {
					...state,
					activeTabId: fileId,
				}
			}
		}

		case UPDATE_ACTIVE_TAB_ID: {
			const { nextActiveTabId } = action
			return {
				...state,
				activeTabId: nextActiveTabId,
			}
		}

		default:
			return state
	}
}

export default userReducer
