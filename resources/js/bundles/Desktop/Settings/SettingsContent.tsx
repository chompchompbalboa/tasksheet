//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISettingsContent } from '@desktop/Settings/Settings'

import SettingsUser from '@desktop/Settings/SettingsUser'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SettingsContent = ({
  activeContent
}: SettingsContentProps) => {

  const content = {
    USER: SettingsUser
  }

  const ContentComponent = activeContent ? content[activeContent] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SettingsContentProps {
  activeContent: ISettingsContent
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsContent
