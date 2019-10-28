//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import {
  ITeam,
  ITeamUpdates
} from '@app/state/team/types'

import { mutation } from '@app/api'

import { IMessengerMessageKey } from '@app/state/messenger/types'
import { createMessengerMessage } from '@app/state/messenger/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type ITeamActions = IUpdateTeam

//-----------------------------------------------------------------------------
// Update Team
//-----------------------------------------------------------------------------
export const UPDATE_TEAM = 'UPDATE_TEAM'
interface IUpdateTeam {
  type: typeof UPDATE_TEAM
  teamId: ITeam['id']
	updates: ITeamUpdates
}


export const updateTeam = (
  teamId: ITeam['id'], 
  updates: ITeamUpdates, 
  errorMessage?: IMessengerMessageKey
): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
		dispatch(updateTeamReducer(teamId, updates))
		mutation.updateTeam(teamId, updates).then(
      null,
      () => {
        errorMessage && dispatch(createMessengerMessage(errorMessage))
      }
    )
	}
}

export const updateTeamReducer = (teamId: ITeam['id'], updates: ITeamUpdates): ITeamActions => {
	return {
    type: UPDATE_TEAM,
    teamId,
		updates
	}
}
