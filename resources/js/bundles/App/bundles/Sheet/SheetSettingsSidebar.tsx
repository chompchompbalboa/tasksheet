//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { SHEET_COLUMN } from '@app/assets/icons'

import { TActiveSheetSetting } from '@app/bundles/Sheet/SheetSettings'

import SheetSettingsSidebarItem from '@app/bundles/Sheet/SheetSettingsSidebarItem'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsSidebar = ({
  activeSheetSetting,
  setActiveSheetSetting
}: SheetSettingsSidebarProps) => {

  return (
    <>
      <SheetSettingsSidebarItem 
        text="Column Types"
        icon={SHEET_COLUMN}
        isActive={activeSheetSetting === 'COLUMN_TYPES'}
        onClick={() => setActiveSheetSetting('COLUMN_TYPES')}/>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsSidebarProps {
  activeSheetSetting: TActiveSheetSetting
  setActiveSheetSetting(nextSheetSetting: TActiveSheetSetting): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsSidebar
