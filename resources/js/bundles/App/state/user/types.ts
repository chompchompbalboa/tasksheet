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
}

export interface UserLayout {
	id: string
	sidebarWidth: number
}
