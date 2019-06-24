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
export const SET_USER = 'SET_USER'
interface SetUserAction {
	type: typeof SET_USER
}

//-----------------------------------------------------------------------------
// Actions
//-----------------------------------------------------------------------------
export type UserActions = SetUserAction
