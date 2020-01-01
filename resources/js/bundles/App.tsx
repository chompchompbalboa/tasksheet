//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { useMediaQuery } from 'react-responsive'
import { appReducer, IAppState } from '@/state'

import Desktop from '@desktop/Desktop'
import Mobile from '@mobile/Mobile'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Root = () => {

  const store = createStore(appReducer, applyMiddleware(thunkMiddleware as ThunkMiddleware<IAppState>))
  
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' })
  const forceDesktopApp = false

  return (
    <ReduxProvider store={store}>
      {isMobile && !forceDesktopApp
        ? <Mobile />
        : <Desktop />}
    </ReduxProvider>
  )
}

//-----------------------------------------------------------------------------
// Mount to DOM
//-----------------------------------------------------------------------------
if (document.getElementById('react-container')) {
	ReactDOM.render(<Root />, document.getElementById('react-container'))
}
