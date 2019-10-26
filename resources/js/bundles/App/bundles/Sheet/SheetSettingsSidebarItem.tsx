//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentSidebarItem from '@app/bundles/Content/ContentSidebarItem'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsSidebarItem = ({
  icon,
  isActive,
  onClick,
  text,
}: ISheetSettingsSidebarItem) => {

  return (
    <ContentSidebarItem 
      icon={icon}
      isActive={isActive}
      onClick={onClick}
      text={text}/> 
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetSettingsSidebarItem {
  icon?: string
  isActive: boolean
  onClick(...args: any): void
  text: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsSidebarItem
