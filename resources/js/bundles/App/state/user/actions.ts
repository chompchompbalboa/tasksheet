//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'
import { ThunkAction, ThunkDispatch } from '@app/state/types'

import { mutation } from '@app/api'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type UserActions = UpdateUserActive | UpdateUserColor

//-----------------------------------------------------------------------------
// Update User Active
//-----------------------------------------------------------------------------
export const UPDATE_USER_ACTIVE = 'UPDATE_USER_ACTIVE'
export type UserActiveUpdates = {
	tabId?: string
	tabs?: string[]
}
interface UpdateUserActive {
	type: typeof UPDATE_USER_ACTIVE
	updates: UserActiveUpdates
}


export const updateUserActive = (updates: UserActiveUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
		dispatch(updateUserActiveReducer(updates))
		mutation.updateUserActive(getState().user.active.id, updates)
	}
}

export const updateUserActiveReducer = (updates: UserActiveUpdates): UserActions => {
	return {
		type: UPDATE_USER_ACTIVE,
		updates: updates,
	}
}

//-----------------------------------------------------------------------------
// Update User Color
//-----------------------------------------------------------------------------
export const UPDATE_USER_COLOR = 'UPDATE_USER_COLOR'
export type UserColorUpdates = {
	primary?: string
	secondary?: string
	tertiary?: string
}
interface UpdateUserColor {
	type: typeof UPDATE_USER_COLOR
	updates: UserColorUpdates
}

let userColorTimeout: number = null
export const updateUserColor = (updates: UserColorUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => AppState) => {
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
