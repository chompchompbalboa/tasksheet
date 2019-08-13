//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { combineReducers } from 'redux'
import historyReducer from '@app/state/history/reducers'
import folderReducer from '@app/state/folder/reducers'
import modalReducer from '@app/state/modal/reducers'
import sheetReducer from '@app/state/sheet/reducers'
import tabReducer from '@app/state/tab/reducers'
import userReducer from '@app/state/user/reducers'

//-----------------------------------------------------------------------------
// Combine Reducers
//-----------------------------------------------------------------------------
export const appReducer = combineReducers({
  history: historyReducer,
	folder: folderReducer,
  modal: modalReducer,
	sheet: sheetReducer,
	tab: tabReducer,
	user: userReducer,
})

export type AppState = ReturnType<typeof appReducer>
