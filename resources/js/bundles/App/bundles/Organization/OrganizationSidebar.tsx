//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IOrganizationContent } from '@app/bundles/Organization/Organization'

import { BILLING, ORGANIZATION, SETTINGS, USER } from '@app/assets/icons'
 
import ContentSidebarItem from '@app/bundles/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const OrganizationSidebar = ({
  activeContent,
  setActiveContent
}: IOrganizationSidebar) => {
  return (
    <>
      <ContentSidebarItem
        icon={ORGANIZATION}
        isActive={activeContent === 'ORGANIZATION_PROFILE'}
        onClick={() => setActiveContent('ORGANIZATION_PROFILE')}
        text="Organization"/>
      <ContentSidebarItem
        icon={USER}
        isActive={activeContent === 'ORGANIZATION_USERS'}
        onClick={() => setActiveContent('ORGANIZATION_USERS')}
        text="Users"/>
      <ContentSidebarItem
        icon={SETTINGS}
        isActive={activeContent === 'ORGANIZATION_SETTINGS'}
        onClick={() => setActiveContent('ORGANIZATION_SETTINGS')}
        text="Settings"/>
      <ContentSidebarItem
        icon={BILLING}
        isActive={activeContent === 'ORGANIZATION_BILLING'}
        onClick={() => setActiveContent('ORGANIZATION_BILLING')}
        text="Billing"/>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IOrganizationSidebar {
  activeContent: IOrganizationContent
  setActiveContent(nextActiveContent: IOrganizationContent): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default OrganizationSidebar
