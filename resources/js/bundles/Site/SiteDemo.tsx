//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { appReducer, IAppState } from '@app/state'

import App from '@app/App'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export default class Root extends React.Component {

	store = createStore(appReducer, applyMiddleware(thunkMiddleware as ThunkMiddleware<IAppState>))

	render() {
		return (
			<ReduxProvider store={this.store}>
				<App />
			</ReduxProvider>
		)
	}
}
