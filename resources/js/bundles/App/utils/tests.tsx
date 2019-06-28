//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { render } from '@testing-library/react'

import { appReducer } from '@app/state'

//-----------------------------------------------------------------------------
// With Redux
//-----------------------------------------------------------------------------
// @ts-ignore
const WithRedux = ({ children }) => {
  const store = createStore(appReducer, applyMiddleware(thunkMiddleware))
  return (
    <ReduxProvider store={store}>
      { children }
    </ReduxProvider>
  )
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export * from '@testing-library/react'
// @ts-ignore
export const renderWithRedux = (ui, options?) => render(ui, { wrapper: WithRedux, ...options })
