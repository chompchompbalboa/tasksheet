//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface User {
	id: string
	name: string
	email: string
	active: UserActive
	color: UserColor
	layout: UserLayout
}

export interface UserActive {
	id: string
	tabId: string
	tabs: string[]
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
