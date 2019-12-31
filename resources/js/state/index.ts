//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { combineReducers } from 'redux'
import activeReducer from '@/state/active/reducers'
import historyReducer from '@/state/history/reducers'
import folderReducer from '@/state/folder/reducers'
import messengerReducer from '@/state/messenger/reducers'
import modalReducer from '@/state/modal/reducers'
import sheetReducer from '@/state/sheet/reducers'
import sheetSettingsReducer from '@/state/sheetSettings/reducers'
import tabReducer from '@/state/tab/reducers'
import teamsReducer from '@/state/team/reducers'
import userReducer from '@/state/user/reducers'

//-----------------------------------------------------------------------------
// Combine Reducers
//-----------------------------------------------------------------------------
export const appReducer = combineReducers({
  active: activeReducer,
  history: historyReducer,
	folder: folderReducer,
  messenger: messengerReducer,
  modal: modalReducer,
  teams: teamsReducer,
	sheet: sheetReducer,
	sheetSettings: sheetSettingsReducer,
	tab: tabReducer,
	user: userReducer,
})

export type IAppState = ReturnType<typeof appReducer>
