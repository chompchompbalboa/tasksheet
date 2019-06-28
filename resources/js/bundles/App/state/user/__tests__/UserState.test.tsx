//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

import { initialUserState, userReducer } from '../reducers'
import {
  UserActions,
  updateUserLayout, updateUserLayoutReducer, UPDATE_USER_LAYOUT, UserLayoutUpdates
} from '../actions'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const axiosMock = new AxiosMockAdapter(axios)
const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

afterEach(() => {
  axiosMock.restore()
})

//-----------------------------------------------------------------------------
// Update User Layout
//-----------------------------------------------------------------------------
describe('Update User Layout', () => {

  axiosMock.onPatch('/app/user/layout/uuid').reply(200)
  const updates: UserLayoutUpdates = { sidebarWidth: 0.13 }

  it('Should correctly call the reducer action', () => {
    const expectedAction: UserActions[] = [{ type: UPDATE_USER_LAYOUT, updates }]
    const store = mockStore({ user: initialUserState })
    // @ts-ignore thunk-action
    return store.dispatch(updateUserLayout(updates)).then(() => {
      expect(store.getActions()).toEqual(expectedAction)
    })
  })
  
  it('Should update sidebarWidth', () => {
    expect(userReducer(undefined, updateUserLayoutReducer(updates))).toEqual({ 
      ...initialUserState, 
      layout: { 
        ...initialUserState.layout, 
        sidebarWidth: 0.13 
      }
    })
  })
})