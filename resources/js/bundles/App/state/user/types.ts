//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface User {
	id: string
	name: string
	email: string
	active: UserActive
	color: UserColor
}

export interface UserActive {
	id: string
	tab: string
	tabs: string[]
}

export interface UserColor {
	id: string
	primary: string
	secondary: string
}
