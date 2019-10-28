//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface IOrganization {
	id: string
  name: string
  users: IOrganizationUser[]
}

export interface IOrganizationUpdates {
  name?: string
}

export interface IOrganizationUser {
  id: string
  name: string
  email: string
}
