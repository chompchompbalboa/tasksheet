//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import Content from '@desktop/Content/Content'
import HelpContent from '@desktop/Help/HelpContent'
import HelpSidebar from '@desktop/Help/HelpSidebar'

export type IHelpContent = 
  'WELCOME' |
    'ABOUT_TASKSHEET' |
    'GETTING_STARTED' |
    'HELPFUL_TIPS' |
  'VIEWS' |
    'FILTERS' |
    'GROUPS' |
    'SORTS'
//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const Help = () => {

  const [ activeContent, setActiveContent ] = useState('WELCOME' as IHelpContent)

  const headers = {
    WELCOME: 'Welcome',
      ABOUT_TASKSHEET: 'About Tasksheet',
      GETTING_STARTED: 'Getting Started',
      HELPFUL_TIPS: 'Helpful Tips',
    VIEWS: 'Views',
      FILTERS: 'Filters',
      GROUPS: 'Groups',
      SORTS: 'Sorts',
  }
  const HelpHeader = () => headers[activeContent]

  const HelpSidebarComponent = () => (
    <HelpSidebar
     activeContent={activeContent}
     setActiveContent={setActiveContent}/>
  )

  const HelpContentComponent = () => (
    <HelpContent
      activeContent={activeContent}/>
  )

  return (
    <Content
      Content={HelpContentComponent}
      Header={HelpHeader}
      Sidebar={HelpSidebarComponent}/>
  )
}

export default Help
