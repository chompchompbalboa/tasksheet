//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { ISheetSettingsActiveSheetSettings } from '@app/state/sheetSettings/types'

import SheetSettingsContentColumnSettings from '@app/bundles/Sheet/SheetSettingsContentColumnSettings'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContent = ({
  activeSheetSetting
}: SheetSettingsContentProps) => {

  const content = {
    COLUMN_SETTINGS: SheetSettingsContentColumnSettings
  }

  const ContentComponent = activeSheetSetting ? content[activeSheetSetting] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentProps {
  activeSheetSetting: ISheetSettingsActiveSheetSettings
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContent
