//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { ThunkAction, ThunkDispatch } from '@app/state/types'
import {
  IUserActiveUpdates,
  IUserColorUpdates
} from './types'

import { mutation } from '@app/api'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IUserActions = IUpdateUserActive | IUpdateUserColor

//-----------------------------------------------------------------------------
// Update User Active
//-----------------------------------------------------------------------------
export const UPDATE_USER_ACTIVE = 'UPDATE_USER_ACTIVE'
interface IUpdateUserActive {
	type: typeof UPDATE_USER_ACTIVE
	updates: IUserActiveUpdates
}


export const updateUserActive = (updates: IUserActiveUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => IAppState) => {
		dispatch(updateUserActiveReducer(updates))
		mutation.updateUserActive(getState().user.active.id, updates)
	}
}

export const updateUserActiveReducer = (updates: IUserActiveUpdates): IUserActions => {
	return {
		type: UPDATE_USER_ACTIVE,
		updates: updates,
	}
}

//-----------------------------------------------------------------------------
// Update User Color
//-----------------------------------------------------------------------------
export const UPDATE_USER_COLOR = 'UPDATE_USER_COLOR'
interface IUpdateUserColor {
	type: typeof UPDATE_USER_COLOR
	updates: IUserColorUpdates
}

let userColorTimeout: number = null
export const updateUserColor = (updates: IUserColorUpdates): ThunkAction => {
	return async (dispatch: ThunkDispatch, getState: () => IAppState) => {
		window.clearTimeout(userColorTimeout)
		dispatch(updateUserColorReducer(updates))
		userColorTimeout = window.setTimeout(() => mutation.updateUserColor(getState().user.color.id, updates), 1500)
	}
}

export const updateUserColorReducer = (updates: IUserColorUpdates): IUserActions => {
	return {
		type: UPDATE_USER_COLOR,
		updates: updates,
	}
}
