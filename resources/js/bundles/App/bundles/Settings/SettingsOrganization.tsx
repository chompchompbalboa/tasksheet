//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import ContentContent from '@app/bundles/Content/ContentContent'
import SettingsOrganizationName from '@app/bundles/Settings/SettingsOrganizationName'
import SettingsOrganizationUsers from '@app/bundles/Settings/SettingsOrganizationUsers'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsOrganization = () => {

  const organizations = useSelector((state: IAppState) => state.organizations)
  const organizationIds = Object.keys(organizations)
  
  const [ activeOrganizationId ] = useState(organizationIds ? organizationIds[0] : null)

  return (
    <ContentContent>
      {activeOrganizationId && 
        <OrganizationsContainer>
          <ActiveOrganizationName>
            {organizations[activeOrganizationId].name}
          </ActiveOrganizationName>
          {organizationIds.length > 1 && 
            <OrganizationsDropdown>
              {organizationIds && organizationIds.map(organizationId => {
                const organization = organizations[organizationId]
                return (
                  <OrganizationsDropdownOption
                    key={organization.id}>
                    {organization.name}
                  </OrganizationsDropdownOption>
                )
              })}
            </OrganizationsDropdown>
          }
          <ActiveOrganization>
            <SettingsOrganizationName
              organization={organizations[activeOrganizationId]}/>
            <SettingsOrganizationUsers
              organization={organizations[activeOrganizationId]}/>
          </ActiveOrganization>
        </OrganizationsContainer>
      }
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const OrganizationsContainer = styled.div``

const ActiveOrganizationName = styled.h2`
  padding: 0.125rem;
`

const OrganizationsDropdown = styled.div``

const OrganizationsDropdownOption = styled.div``

const ActiveOrganization = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 0.5rem;
`

export default SettingsOrganization
