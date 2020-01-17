//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { IHelpContent } from '@desktop/Help/Help'
 
import ContentSidebarItem from '@desktop/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const HelpSidebar = ({
  activeContent,
  setActiveContent
}: IHelpSidebar) => {
  return (
    <>
      <ContentSidebarItem
        isActive={activeContent === 'WELCOME'}
        onClick={() => setActiveContent('WELCOME')}
        text="Welcome"
        textFontWeight="bold"
        textMarginLeft="0.3rem"/>
        <ContentSidebarItem
          isActive={activeContent === 'GETTING_STARTED'}
          onClick={() => setActiveContent('GETTING_STARTED')}
          text="Getting Started"/>
        <ContentSidebarItem
          isActive={activeContent === 'HELPFUL_TIPS'}
          onClick={() => setActiveContent('HELPFUL_TIPS')}
          text="Helpful Tips"/>
        <ContentSidebarItem
          isActive={activeContent === 'FAQ'}
          onClick={() => setActiveContent('FAQ')}
          text="FAQ"/>
      <ContentSidebarItem
        isActive={activeContent === 'VIEWS'}
        onClick={() => setActiveContent('VIEWS')}
        text="Views"
        textFontWeight="bold"
        textMarginLeft="0.3rem"/>
        <ContentSidebarItem
          isActive={activeContent === 'FILTERS'}
          onClick={() => setActiveContent('FILTERS')}
          text="Filters"/>
        <ContentSidebarItem
          isActive={activeContent === 'GROUPS'}
          onClick={() => setActiveContent('GROUPS')}
          text="Groups"/>
        <ContentSidebarItem
          isActive={activeContent === 'SORTS'}
          onClick={() => setActiveContent('SORTS')}
          text="Sorts"/>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IHelpSidebar {
  activeContent: IHelpContent
  setActiveContent(nextActiveContent: IHelpContent): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default HelpSidebar
