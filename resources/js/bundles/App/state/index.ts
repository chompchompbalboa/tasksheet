//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { combineReducers } from 'redux'
import folderReducer from '@app/state/folder/reducers'
import sheetReducer from '@app/state/sheet/reducers'
import tabReducer from '@app/state/tab/reducers'
import userReducer from '@app/state/user/reducers'

//-----------------------------------------------------------------------------
// Combine Reducers
//-----------------------------------------------------------------------------
export const appReducer = combineReducers({
	folder: folderReducer,
	sheet: sheetReducer,
	tab: tabReducer,
	user: userReducer,
})

export type AppState = ReturnType<typeof appReducer>
