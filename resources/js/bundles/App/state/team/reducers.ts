//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@app/state/initialData'
import { ITeam } from '@app/state/team/types'
import { 
  ITeamActions, 
  UPDATE_TEAM,
} from '@app/state/team/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialTeamState: ITeamState = {}

if(typeof initialData !== 'undefined') {
  initialData.teams.forEach(team => {
    initialTeamState[team.id] = team
  })
}
else {
  defaultInitialData.teams.forEach(team => {
    initialTeamState[team.id] = team
  })
}

export interface ITeamState { 
  [teamId: string]: ITeam 
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
        [teamId]: {
          ...state[teamId], ...updates
        } 
      }
		}

		default:
			return state
	}
}

export default teamReducer
