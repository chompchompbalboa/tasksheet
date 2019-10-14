//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'
import { ISheetSettingsActiveSheetSettings } from '@app/state/sheetSettings/types'
import { updateSheetSettings } from '@app/state/sheetSettings/actions'

import AppContent from '@app/bundles/Content/Content'
import SheetSettingsContent from '@app/bundles/Sheet/SheetSettingsContent'
import SheetSettingsSidebar from '@app/bundles/Sheet/SheetSettingsSidebar'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettings = ({
}: SheetSettingsProps) => {
  
  const dispatch = useDispatch()
  const activeSheetSetting = useSelector((state: IAppState) => state.sheetSettings.activeSheetSetting)

  const Content = () => (
    <SheetSettingsContent
      activeSheetSetting={activeSheetSetting}/>
  )

  const Sidebar = () => (
    <SheetSettingsSidebar 
      activeSheetSetting={activeSheetSetting}
      setActiveSheetSetting={(nextActiveSheetSetting: ISheetSettingsActiveSheetSettings) => dispatch(updateSheetSettings({ activeSheetSetting: nextActiveSheetSetting }))}/>
  )

  const headers = {
    COLUMN_SETTINGS: 'Column Settings'
  }

  const Header = () => headers[activeSheetSetting]

  return (
    <AppContent
      testId='SheetSettings'
      Sidebar={Sidebar}
      Content={Content}
      Header={Header}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsProps {}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettings
