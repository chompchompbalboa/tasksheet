//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IHelpContent } from '@desktop/Help/Help'

import AboutTasksheet from '@desktop/Help/Topics/AboutTasksheet'
import Filters from '@desktop/Help/Topics/Filters'
import GettingStarted from '@desktop/Help/Topics/GettingStarted'
import HelpfulTips from '@desktop/Help/Topics/HelpfulTips'
import Groups from '@desktop/Help/Topics/Groups'
import Sorts from '@desktop/Help/Topics/Sorts'
import Views from '@desktop/Help/Topics/Views'
import Welcome from '@desktop/Help/Topics/Welcome'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const HelpContent = ({
  activeContent
}: HelpContentProps) => {

  const content = {
    WELCOME: Welcome,
      ABOUT_TASKSHEET: AboutTasksheet,
      GETTING_STARTED: GettingStarted,
      HELPFUL_TIPS: HelpfulTips,
    VIEWS: Views,
      FILTERS: Filters,
      GROUPS: Groups,
      SORTS: Sorts,
  }

  const ContentComponent = activeContent ? content[activeContent] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface HelpContentProps {
  activeContent: IHelpContent
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpContent
