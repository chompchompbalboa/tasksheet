//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import AppContent from '@app/bundles/Content/Content'

import SheetSettingsContent from '@app/bundles/Sheet/SheetSettingsContent'
import SheetSettingsSidebar from '@app/bundles/Sheet/SheetSettingsSidebar'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettings = ({
}: SheetSettingsProps) => {

  const [ activeSheetSetting, setActiveSheetSetting ] = useState('COLUMN_TYPES' as TActiveSheetSetting)

  const Content = () => (
    <SheetSettingsContent
      activeSheetSetting={activeSheetSetting}/>
  )

  const Sidebar = () => (
    <SheetSettingsSidebar 
      activeSheetSetting={activeSheetSetting}
      setActiveSheetSetting={setActiveSheetSetting}/>
  )

  const headers = {
    COLUMN_TYPES: 'Column Types'
  }

  const Header = () => headers[activeSheetSetting]

  return (
    <AppContent
      Sidebar={Sidebar}
      Content={Content}
      Header={Header}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsProps {
}

export type TActiveSheetSetting = 'COLUMN_TYPES'

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettings
