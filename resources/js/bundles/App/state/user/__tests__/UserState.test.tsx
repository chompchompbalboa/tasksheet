//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { AppState, appReducer } from '@app/state'
import {
  updateUserLayout, UserLayoutUpdates
} from '../actions'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const axiosMock = new AxiosMockAdapter(axios)
const mockStore = createStore(appReducer, applyMiddleware(thunkMiddleware))

afterEach(() => {
  axiosMock.restore()
})

//-----------------------------------------------------------------------------
// Update User Layout
//-----------------------------------------------------------------------------
describe('Update User Layout', () => {

  const store = mockStore
  const updates: UserLayoutUpdates = { sidebarWidth: 0.13 }
  
  axiosMock.onPatch('/app/user/layout/uuid').reply(200)
  
  it('Should update sidebarWidth', () => {
    // @ts-ignore thunk-action
    return store.dispatch(updateUserLayout(updates)).then(() => {
      const state: AppState = store.getState()
      expect(state.user.layout.sidebarWidth).toEqual(0.13)
    })
  })
})