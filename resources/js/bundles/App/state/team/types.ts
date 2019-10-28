//-----------------------------------------------------------------------------
// Teams
//-----------------------------------------------------------------------------
export interface ITeam {
	id: string
  name: string
  members: ITeamMember[]
}

export interface ITeamUpdates {
  name?: string
}

export interface ITeamMember {
  id: string
  name: string
  email: string
}
