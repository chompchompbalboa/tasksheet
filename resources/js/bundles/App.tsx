//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { useMediaQuery } from 'react-responsive'
import { appReducer, IAppState } from '@app/state'

import App from '@app/App'
import MobileApp from '@app/bundles/Mobile/MobileApp'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Root = () => {

  const store = createStore(appReducer, applyMiddleware(thunkMiddleware as ThunkMiddleware<IAppState>))
  
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' })
  const isMobileSiteUnderConstruction = true

  return (
    <ReduxProvider store={store}>
      {isMobile && !isMobileSiteUnderConstruction
        ? <MobileApp />
        : <App />}
    </ReduxProvider>
  )
}

//-----------------------------------------------------------------------------
// Mount to DOM
//-----------------------------------------------------------------------------
if (document.getElementById('react-container')) {
	ReactDOM.render(<Root />, document.getElementById('react-container'))
}
