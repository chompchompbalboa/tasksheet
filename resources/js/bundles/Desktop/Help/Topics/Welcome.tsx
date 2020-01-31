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
        Hi there. Welcome to Todosheet!
      </HelpText>
      <HelpText>
        The information in the topics below have been organized to help you get started using Todosheet. There are also examples of the recommended best practices.
      </HelpText>
      <HelpText>
        Keeping things simple is a core part of our development philosophy. We hope that Todosheet is intuitive enough to use that this documentation isn't necessary - but if you're stuck, odds are the answers are here!
      </HelpText>
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Welcome
