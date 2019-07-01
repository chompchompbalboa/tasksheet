//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Dispatch } from 'redux'
import { AppState } from '@app/state'

import { mutation } from '@app/api'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type UserActions = UpdateUserColor | UpdateUserLayout

//-----------------------------------------------------------------------------
// Update User Color
//-----------------------------------------------------------------------------
export const UPDATE_USER_COLOR = 'UPDATE_USER_COLOR'

let userColorTimeout: number = null
export const updateUserColor = (updates: UserColorUpdates) => {
	return async (dispatch: Dispatch, getState: () => AppState) => {
		window.clearTimeout(userColorTimeout)
		dispatch(updateUserColorReducer(updates))
		userColorTimeout = window.setTimeout(() => mutation.updateUserColor(getState().user.color.id, updates), 1500)
	}
}

export const updateUserColorReducer = (updates: UserColorUpdates): UserActions => {
	return {
		type: UPDATE_USER_COLOR,
		updates: updates,
	}
}

export type UserColorUpdates = {
	primary?: string
	secondary?: string
	tertiary?: string
}

interface UpdateUserColor {
	type: typeof UPDATE_USER_COLOR
	updates: UserColorUpdates
}

//-----------------------------------------------------------------------------
// Update User Layout
//-----------------------------------------------------------------------------
export const UPDATE_USER_LAYOUT = 'UPDATE_USER_LAYOUT'

export const updateUserLayout = (updates: UserLayoutUpdates) => {
	return async (dispatch: Dispatch, getState: () => AppState) => {
		dispatch(updateUserLayoutReducer(updates))
		mutation.updateUserLayout(getState().user.layout.id, updates)
	}
}

export const updateUserLayoutReducer = (updates: UserLayoutUpdates): UserActions => {
	return {
		type: UPDATE_USER_LAYOUT,
		updates: updates,
	}
}

export type UserLayoutUpdates = {
	sidebarWidth?: number
}

interface UpdateUserLayout {
	type: typeof UPDATE_USER_LAYOUT
	updates: UserLayoutUpdates
}
