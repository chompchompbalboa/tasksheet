//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { appReducer } from '@app/state'

import App from '@app/App'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export default class Root extends React.Component {

	store = createStore(appReducer, applyMiddleware(thunkMiddleware))

	render() {
		return (
			<ReduxProvider store={this.store}>
				<App />
			</ReduxProvider>
		)
	}
}

//-----------------------------------------------------------------------------
// Mount to DOM
//-----------------------------------------------------------------------------
if (document.getElementById('react-container')) {
	ReactDOM.render(<Root />, document.getElementById('react-container'))
}
