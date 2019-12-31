//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'

import { appReducer, IAppState } from '@/state'

export const createMockStore = (state: any) => createStore(appReducer, state, applyMiddleware(thunkMiddleware as ThunkMiddleware<IAppState>))
