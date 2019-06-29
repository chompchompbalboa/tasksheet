//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Dispatch } from 'redux'
import { AppState } from '@app/state'

import { mutation } from '@app/api'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type UserActions = UpdateUserLayout

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
