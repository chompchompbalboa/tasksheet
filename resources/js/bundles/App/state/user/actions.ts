//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import {
  IUser,
  IUserUpdates,
  IUserActiveUpdates,
  IUserColorUpdates
} from './types'

import { mutation } from '@app/api'

import { IMessengerMessageKey } from '@app/state/messenger/types'
import { createMessengerMessage } from '@app/state/messenger/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IUserActions = IUpdateUser | IUpdateUserActive | IUpdateUserColor

//-----------------------------------------------------------------------------
// Update User
//-----------------------------------------------------------------------------
export const UPDATE_USER = 'UPDATE_USER'
interface IUpdateUser {
	type: typeof UPDATE_USER
	updates: IUserUpdates
}


export const updateUser = (
  userId: IUser['id'], 
  updates: IUserUpdates, 
  errorMessage?: IMessengerMessageKey
): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
		dispatch(updateUserReducer(updates))
		mutation.updateUser(userId, updates).then(
      null,
      () => {
        errorMessage && dispatch(createMessengerMessage(errorMessage))
      }
    )
	}
}

export const updateUserReducer = (updates: IUserUpdates): IUserActions => {
	return {
		type: UPDATE_USER,
		updates: updates,
	}
}

//-----------------------------------------------------------------------------
// Update User Active
//-----------------------------------------------------------------------------
export const UPDATE_USER_ACTIVE = 'UPDATE_USER_ACTIVE'
interface IUpdateUserActive {
	type: typeof UPDATE_USER_ACTIVE
	updates: IUserActiveUpdates
}


export const updateUserActive = (updates: IUserActiveUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
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
export const updateUserColor = (updates: IUserColorUpdates): IThunkAction => {
	return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
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
