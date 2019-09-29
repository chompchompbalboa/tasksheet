//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { 
  IAppState, 
  appReducer 
} from '@app/state'
import {
  IUserColorUpdates
} from '@app/state/user/types'
import {
  updateUserColor
} from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const axiosMock = new AxiosMockAdapter(axios)
const mockStore = createStore(appReducer, applyMiddleware(thunkMiddleware))

afterEach(() => {
  axiosMock.restore()
})

//-----------------------------------------------------------------------------
// Update User Color
//-----------------------------------------------------------------------------

describe('Update User Color', () => {

  const store = mockStore
  
  axiosMock.onPatch('/app/user/color/uuid').reply(200)
  
  it('Should update the primary color', () => {
    const updatePrimary: IUserColorUpdates = { primary: '#FFFFFF' }
    // @ts-ignore thunk-action
    return store.dispatch(updateUserColor(updatePrimary)).then(() => {
      const state: IAppState = store.getState()
      expect(state.user.color.primary).toEqual("#FFFFFF")
    })
  })
  
  it('Should update the secondary color', () => {
    const updateSecondary: IUserColorUpdates = { secondary: '#CCCCCC' }
    // @ts-ignore thunk-action
    return store.dispatch(updateUserColor(updateSecondary)).then(() => {
      const state: IAppState = store.getState()
      expect(state.user.color.secondary).toEqual("#CCCCCC")
    })
  })
})