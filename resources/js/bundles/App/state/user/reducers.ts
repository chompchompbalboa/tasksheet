//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { User, UserActions, UserColor, UserLayout, UPDATE_USER_LAYOUT } from '@app/state/user/types'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const initialState: User = {
	id: initialData.user.id,
	name: initialData.user.name,
	email: initialData.user.email,
	color: <UserColor>{
		id: initialData.user.color.id,
		primary: initialData.user.color.primary,
		secondary: initialData.user.color.secondary,
		tertiary: initialData.user.color.tertiary,
	},
	layout: <UserLayout>{
		id: initialData.user.layout.id,
		sidebarWidth: initialData.user.layout.sidebarWidth,
	},
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
const userReducers = (state = initialState, action: UserActions): User => {
	switch (action.type) {
      
    case UPDATE_USER_LAYOUT:
      const {
        updates
      } = action
      return { ...state, layout: { ...state.layout, ...updates }}
      
		default:
			return state
	}
}

export default userReducers
