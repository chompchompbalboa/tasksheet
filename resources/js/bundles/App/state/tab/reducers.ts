//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import clone from '@/utils/clone'

import defaultInitialData from '@app/state/initialData'

import { 
  ITabActions, 
  CLOSE_TAB, 
  OPEN_FILE, 
  OPEN_FILE_IN_NEW_TAB, 
  UPDATE_ACTIVE_TAB,
  UPDATE_TABS
} from '@app/state/tab/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const initialActiveState = typeof initialData !== 'undefined' ? initialData.user.active : defaultInitialData.user.active
export const initialTabState: ITabState = {
  //activeTab: 'SHEET_SETTINGS',
	activeTab: initialActiveState.tab === null ? 'FOLDERS' : initialActiveState.tab,
	tabs: initialActiveState.tabs === null ? [] : initialActiveState.tabs,
}
export type ITabState = {
	activeTab: string
	tabs: string[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialTabState, action: ITabActions): ITabState => {
	switch (action.type) {
		case CLOSE_TAB: {
			const { fileId } = action
			const { activeTab, tabs } = state
			const tabIndex = tabs.findIndex(tabId => tabId === fileId)
			const nextTabs = tabs.filter(tabFileId => tabFileId !== fileId)
			const willAnyTabsBeOpen = nextTabs.length > 0
			const wasClosedTabActiveTab = fileId === activeTab
			const wasClosedTabFirstTab = tabIndex === 0
			const wasClosedTabLastTab = tabIndex === tabs.length - 1
			const nextActiveTabIndex = wasClosedTabFirstTab ? 0 : wasClosedTabLastTab ? tabIndex - 1 : tabIndex
			const nextActiveTab = willAnyTabsBeOpen
				? wasClosedTabActiveTab
					? nextTabs[nextActiveTabIndex]
					: activeTab
				: null
			return {
				...state,
				activeTab: nextActiveTab,
				tabs: nextTabs,
			}
		}

		case OPEN_FILE: {
			const { activeTab, tabs } = state
			const { fileId } = action
			const nextTabs = clone(state.tabs)
			const activeTabIndex = tabs.findIndex(tabId => tabId === activeTab)
			nextTabs[activeTabIndex] = fileId
			return {
				...state,
				activeTab: fileId,
				tabs: nextTabs,
			}
		}

		case OPEN_FILE_IN_NEW_TAB: {
			const { fileId } = action
			const { tabs } = state
			if (!tabs.includes(fileId)) {
				return { ...state, activeTab: fileId, tabs: [...state.tabs, fileId] }
			} else {
				return {
					...state,
					activeTab: fileId,
				}
			}
		}

		case UPDATE_ACTIVE_TAB: {
			const { nextActiveTab } = action
			return {
				...state,
				activeTab: nextActiveTab,
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
