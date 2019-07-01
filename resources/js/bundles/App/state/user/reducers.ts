//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@app/state/initialData'
import { User } from '@app/state/user/types'
import { UserActions, UPDATE_USER_COLOR, UPDATE_USER_LAYOUT } from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialUserState: User = typeof initialData !== 'undefined' ? initialData.user : defaultInitialData.user

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialUserState, action: UserActions): User => {
	switch (action.type) {
		case UPDATE_USER_COLOR: {
			const { updates } = action
			return { ...state, color: { ...state.color, ...updates } }
		}

		case UPDATE_USER_LAYOUT: {
			const { updates } = action
			return { ...state, layout: { ...state.layout, ...updates } }
		}

		default:
			return state
	}
}

export default userReducer
