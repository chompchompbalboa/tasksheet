//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { combineReducers } from 'redux'
import activeReducer from '@app/state/active/reducers'
import historyReducer from '@app/state/history/reducers'
import folderReducer from '@app/state/folder/reducers'
import messengerReducer from '@app/state/messenger/reducers'
import modalReducer from '@app/state/modal/reducers'
import sheetReducer from '@app/state/sheet/reducers'
import sheetSettingsReducer from '@app/state/sheetSettings/reducers'
import tabReducer from '@app/state/tab/reducers'
import teamsReducer from '@app/state/team/reducers'
import userReducer from '@app/state/user/reducers'

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
