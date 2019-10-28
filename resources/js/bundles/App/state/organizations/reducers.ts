//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@app/state/initialData'
import { IOrganization } from '@app/state/organizations/types'
import { 
  IOrganizationActions, 
  UPDATE_ORGANIZATION,
} from '@app/state/organizations/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialOrganizationState: IOrganizationState = {}

if(typeof initialData !== 'undefined') {
  initialData.organizations.forEach(organization => {
    initialOrganizationState[organization.id] = organization
  })
}
else {
  defaultInitialData.organizations.forEach(organization => {
    initialOrganizationState[organization.id] = organization
  })
}

export interface IOrganizationState { 
  [organizationId: string]: IOrganization 
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const organizationReducer = (state = initialOrganizationState, action: IOrganizationActions): IOrganizationState => {
	switch (action.type) {
    
		case UPDATE_ORGANIZATION: {
			const { organizationId, updates } = action
			return { 
        ...state,
        [organizationId]: {
          ...state[organizationId], ...updates
        } 
      }
		}

		default:
			return state
	}
}

export default organizationReducer
