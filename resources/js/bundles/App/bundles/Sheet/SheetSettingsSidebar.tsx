//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { SHEET_COLUMN } from '@app/assets/icons'

import { ISheetSettingsActiveSheetSettings } from '@app/state/sheetSettings/types'

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
        text="Column Settings"
        icon={SHEET_COLUMN}
        isActive={activeSheetSetting === 'COLUMN_SETTINGS'}
        onClick={() => setActiveSheetSetting('COLUMN_SETTINGS')}/>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsSidebarProps {
  activeSheetSetting: ISheetSettingsActiveSheetSettings
  setActiveSheetSetting(nextSheetSetting: ISheetSettingsActiveSheetSettings): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsSidebar
