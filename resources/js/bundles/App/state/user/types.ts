//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface User {
	id: string
	name: string
	email: string
	color: UserColor
	layout: UserLayout
}

export interface UserColor {
	id: string
	primary: string
	secondary: string
	tertiary: string
}

export interface UserLayout {
	id: string
	sidebarWidth: number
}

//-----------------------------------------------------------------------------
// Set User
//-----------------------------------------------------------------------------
export const UPDATE_USER_LAYOUT = 'UPDATE_USER_LAYOUT'
interface UpdateUserLayoutAction {
	type: typeof UPDATE_USER_LAYOUT
  updates: {
    sidebarWidth?: number
  }
}
export type UserLayoutUpdates = {
  sidebarWidth?: number
}

//-----------------------------------------------------------------------------
// Actions
//-----------------------------------------------------------------------------
export type UserActions = UpdateUserLayoutAction
