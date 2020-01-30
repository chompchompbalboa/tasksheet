//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IHelpContent } from '@desktop/Help/Help'

import FAQ from '@desktop/Help/Topics/FAQ'
import Filters from '@desktop/Help/Topics/Filters'
import HelpfulTips from '@desktop/Help/Topics/HelpfulTips'
import Groups from '@desktop/Help/Topics/Groups'
import Sorts from '@desktop/Help/Topics/Sorts'
import Views from '@desktop/Help/Topics/Views'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const HelpContent = ({
  activeContent
}: HelpContentProps) => {

  const EmptyElement = () => <></>

  const content = {
    GETTING_STARTED: EmptyElement,
      FAQ: FAQ,
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
