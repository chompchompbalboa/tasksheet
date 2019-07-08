//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import clone from '@/utils/clone'

import { TabActions, OPEN_FILE, OPEN_FILE_IN_NEW_TAB } from '@app/state/tab/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialTabState: TabState = {
	activeTab: 0,
	tabs: [],
}
export type TabState = {
	activeTab: number
	tabs: string[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialTabState, action: TabActions): TabState => {
	switch (action.type) {
		case OPEN_FILE: {
			const { activeTab } = state
			const { fileId } = action
			const nextTabs = clone(state.tabs)
			nextTabs[activeTab] = fileId
			return { ...state, tabs: nextTabs }
		}

		case OPEN_FILE_IN_NEW_TAB: {
			const { fileId } = action
			return { ...state, tabs: [...state.tabs, fileId] }
		}
		default:
			return state
	}
}

export default userReducer
