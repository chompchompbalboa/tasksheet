//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { AppState, appReducer } from '@app/state'
import {
  updateUserColor, UserColorUpdates,
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

//-----------------------------------------------------------------------------
// Update User Color
//-----------------------------------------------------------------------------

describe('Update User Color', () => {

  const store = mockStore
  
  axiosMock.onPatch('/app/user/color/uuid').reply(200)
  
  it('Should update the primary color', () => {
    const updatePrimary: UserColorUpdates = { primary: '#FFFFFF' }
    // @ts-ignore thunk-action
    return store.dispatch(updateUserColor(updatePrimary)).then(() => {
      const state: AppState = store.getState()
      expect(state.user.color.primary).toEqual("#FFFFFF")
    })
  })
  
  it('Should update the secondary color', () => {
    const updateSecondary: UserColorUpdates = { secondary: '#CCCCCC' }
    // @ts-ignore thunk-action
    return store.dispatch(updateUserColor(updateSecondary)).then(() => {
      const state: AppState = store.getState()
      expect(state.user.color.secondary).toEqual("#CCCCCC")
    })
  })
})