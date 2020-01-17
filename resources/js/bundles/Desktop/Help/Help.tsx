//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import Content from '@desktop/Content/Content'
import HelpContent from '@desktop/Help/HelpContent'
import HelpSidebar from '@desktop/Help/HelpSidebar'

export type IHelpContent = 
  'WELCOME' |
    'GETTING_STARTED' |
    'HELPFUL_TIPS' |
    'FAQ' |
  'VIEWS' |
    'FILTERS' |
    'GROUPS' |
    'SORTS'
//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const Help = () => {

  const [ activeContent, setActiveContent ] = useState('GETTING_STARTED' as IHelpContent)

  const headers = {
    WELCOME: 'Welcome',
      GETTING_STARTED: 'Getting Started',
      HELPFUL_TIPS: 'Helpful Tips',
      FAQ: 'FAQ',
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
