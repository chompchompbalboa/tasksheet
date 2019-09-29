//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface IUser {
	id: string
	name: string
	email: string
	active: IUserActive
	color: IUserColor
}

export interface IUserActive {
	id: string
	tab: string
	tabs: string[]
}

export interface IUserActiveUpdates {
	tab?: string
	tabs?: string[]
}

export interface IUserColor {
	id: string
	primary: string
	secondary: string
}

export interface IUserColorUpdates {
	primary?: string
	secondary?: string
	tertiary?: string
}
