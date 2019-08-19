//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import clone from '@/utils/clone'

import defaultInitialData from '@app/state/initialData'

import { 
  TabActions, 
  CLOSE_TAB, 
  OPEN_FILE, 
  OPEN_FILE_IN_NEW_TAB, 
  UPDATE_ACTIVE_TAB_ID,
  UPDATE_TABS
} from '@app/state/tab/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const initialActiveState = typeof initialData !== 'undefined' ? initialData.user.active : defaultInitialData.user.active
export const initialTabState: TabState = {
	//activeTabId: 'FOLDERS',
	activeTabId: initialActiveState.tabId === null ? 'FOLDERS' : initialActiveState.tabId,
	tabs: initialActiveState.tabs === null ? [] : initialActiveState.tabs,
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
			const willAnyTabsBeOpen = nextTabs.length > 0
			const wasClosedTabActiveTab = fileId === activeTabId
			const wasClosedTabFirstTab = tabIndex === 0
			const wasClosedTabLastTab = tabIndex === tabs.length - 1
			const nextActiveTabIdIndex = wasClosedTabFirstTab ? 0 : wasClosedTabLastTab ? tabIndex - 1 : tabIndex
			const nextActiveTabId = willAnyTabsBeOpen
				? wasClosedTabActiveTab
					? nextTabs[nextActiveTabIdIndex]
					: activeTabId
				: null
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

		case UPDATE_TABS: {
			const { nextTabs } = action
			return {
				...state,
				tabs: nextTabs,
			}
		}

		default:
			return state
	}
}

export default userReducer
