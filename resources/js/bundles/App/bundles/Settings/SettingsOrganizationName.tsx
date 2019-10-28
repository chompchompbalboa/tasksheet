//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IOrganization } from '@app/state/organizations/types'

import { updateOrganization } from '@app/state/organizations/actions'

import SettingsLabelledInput from '@app/bundles/Settings/SettingsLabelledInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsOrganizationName = ({
  organization: {
    id: organizationId,
    name: organizationName
  }
}: ISettingsOrganizationName) => {

  const dispatch = useDispatch()
  const [ localOrganizationName, setLocalOrganizationName ] = useState(organizationName)

  const updateOrganizationName = () => {
    if(organizationName !== localOrganizationName) {
      dispatch(updateOrganization(
        organizationId, 
        { name: localOrganizationName },
        'ORGANIZATION_UPDATE_ORGANIZATION_NAME_ERROR'
      ))
    }
  }

  return (
    <SettingsLabelledInput
      label="Name:"
      onBlur={() => updateOrganizationName()}
      onChange={nextOrganizationName => setLocalOrganizationName(nextOrganizationName)}
      value={localOrganizationName}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsOrganizationName {
  organization: IOrganization
}

export default SettingsOrganizationName
