//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@app/state/types'
import {
  IOrganization,
  IOrganizationUpdates
} from './types'

import { mutation } from '@app/api'

import { IMessengerMessageKey } from '@app/state/messenger/types'
import { createMessengerMessage } from '@app/state/messenger/actions'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IOrganizationActions = IUpdateOrganization

//-----------------------------------------------------------------------------
// Update Organization
//-----------------------------------------------------------------------------
export const UPDATE_ORGANIZATION = 'UPDATE_ORGANIZATION'
interface IUpdateOrganization {
  type: typeof UPDATE_ORGANIZATION
  organizationId: IOrganization['id']
	updates: IOrganizationUpdates
}


export const updateOrganization = (
  organizationId: IOrganization['id'], 
  updates: IOrganizationUpdates, 
  errorMessage?: IMessengerMessageKey
): IThunkAction => {
	return async (dispatch: IThunkDispatch) => {
		dispatch(updateOrganizationReducer(organizationId, updates))
		mutation.updateOrganization(organizationId, updates).then(
      null,
      () => {
        errorMessage && dispatch(createMessengerMessage(errorMessage))
      }
    )
	}
}

export const updateOrganizationReducer = (organizationId: IOrganization['id'], updates: IOrganizationUpdates): IOrganizationActions => {
	return {
    type: UPDATE_ORGANIZATION,
    organizationId,
		updates
	}
}
