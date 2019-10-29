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
  members?: ITeamMember[]
}

export interface ITeamMember {
  id: string
  name: string
  email: string
}
