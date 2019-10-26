//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import Content from '@app/bundles/Content/Content'
import OrganizationContent from '@app/bundles/Organization/OrganizationContent'
import OrganizationSidebar from '@app/bundles/Organization/OrganizationSidebar'

export type IOrganizationContent = 
  'ORGANIZATION_BILLING' |
  'ORGANIZATION_PROFILE' | 
  'ORGANIZATION_SETTINGS' | 
  'ORGANIZATION_USERS'
//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const Organization = () => {

  const [ activeContent, setActiveContent ] = useState('ORGANIZATION_PROFILE' as IOrganizationContent)

  const headers = {
    ORGANIZATION_BILLING: 'Billing',
    ORGANIZATION_PROFILE: 'Profile',
    ORGANIZATION_SETTINGS: 'Settings',
    ORGANIZATION_USERS: 'Users',
  }
  const OrganizationHeader = () => headers[activeContent]

  const OrganizationSidebarComponent = () => (
    <OrganizationSidebar
     activeContent={activeContent}
     setActiveContent={setActiveContent}/>
  )

  const OrganizationContentComponent = () => (
    <OrganizationContent
      activeContent={activeContent}/>
  )

  return (
    <Content
      Content={OrganizationContentComponent}
      Header={OrganizationHeader}
      Sidebar={OrganizationSidebarComponent}/>
  )
}

export default Organization
