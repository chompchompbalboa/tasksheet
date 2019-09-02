//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import Content from '@app/bundles/Content/Content'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const Organization = ({
}: OrganizationProps) => {
  return (
    <Content
      Sidebar={OrganizationSidebar}
      Content={OrganizationContent}
      Header={OrganizationHeader}/>
  )
}

const OrganizationSidebar = () => {
  return (
    <>
      Organization Sidebar
    </>
  )
}

const OrganizationHeader = () => {
  return (
    <>
      Organization Header
    </>
  )
}

const OrganizationContent = () => {
  return (
    <>
      Organization Content
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface OrganizationProps {
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Organization
