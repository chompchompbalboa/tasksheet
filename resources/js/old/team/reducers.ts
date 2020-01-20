//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@/state/initialData'
import { 
  ITeam,
  ITeamMember
} from '@/state/team/types'
import { 
  ITeamActions, 
  UPDATE_TEAM,
} from '@/state/team/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialTeamState: ITeamState = {
  allTeams: {},
  allTeamMembers: {}
}

const teamInitialData = typeof initialData !== 'undefined' ? initialData : defaultInitialData

teamInitialData.teams.forEach(team => {
  initialTeamState.allTeams[team.id] = {
    id: team.id,
    name: team.name,
    members: team.members.map(teamMember => teamMember.id)
  }
  team.members.forEach(teamMember => {
    initialTeamState.allTeamMembers[teamMember.id] = {
      id: teamMember.id,
      name: teamMember.name,
      email: teamMember.email
    }
  })
})

export interface ITeamState {
  allTeams: {
    [teamId: string]: ITeam 
  },
  allTeamMembers: {
    [teamMemberId: string]: ITeamMember
  }
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const teamReducer = (state = initialTeamState, action: ITeamActions): ITeamState => {
	switch (action.type) {
    
		case UPDATE_TEAM: {
			const { teamId, updates } = action
			return { 
        ...state,
        allTeams: {
          ...state.allTeams,
          [teamId]: {
            ...state.allTeams[teamId], ...updates
          } 
        }
      }
		}

		default:
			return state
	}
}

export default teamReducer
