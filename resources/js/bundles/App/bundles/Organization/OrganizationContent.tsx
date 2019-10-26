//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IOrganizationContent } from '@app/bundles/Organization/Organization'

import OrganizationBilling from '@app/bundles/Organization/OrganizationBilling'
import OrganizationProfile from '@app/bundles/Organization/OrganizationProfile'
import OrganizationSettings from '@app/bundles/Organization/OrganizationSettings'
import OrganizationUsers from '@app/bundles/Organization/OrganizationUsers'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const OrganizationContent = ({
  activeContent
}: OrganizationContentProps) => {

  const content = {
    ORGANIZATION_BILLING: OrganizationBilling,
    ORGANIZATION_PROFILE: OrganizationProfile,
    ORGANIZATION_SETTINGS: OrganizationSettings,
    ORGANIZATION_USERS: OrganizationUsers,
  }

  const ContentComponent = activeContent ? content[activeContent] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface OrganizationContentProps {
  activeContent: IOrganizationContent
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default OrganizationContent
