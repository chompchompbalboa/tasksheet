//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@desktop/Content/ContentContent'
import HelpText from '@desktop/Help/HelpText'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Welcome = () => {

  return (
    <ContentContent>
      <HelpText>
        Hi there. Welcome to Tasksheet! We're glad you're here.
      </HelpText>
      <HelpText>
        The information in the help topics below have been organized to give you a quick - but thorough - understanding of how to use Tasksheet. We will also discuss best practices that we have found helpful as we've used Tasksheet internally.
      </HelpText>
      <HelpText>
        If you have any questions as you learn Tasksheet, please don't hesitate to reach out to our support team: <a href="mailto: support@tasksheet.app">support@tasksheet.app</a>
      </HelpText>
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Welcome
