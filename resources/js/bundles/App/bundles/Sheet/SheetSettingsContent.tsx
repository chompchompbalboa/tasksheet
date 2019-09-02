//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { TActiveSheetSetting } from '@app/bundles/Sheet/SheetSettings'

import SheetSettingsContentColumnTypes from '@app/bundles/Sheet/SheetSettingsContentColumnTypes'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const SheetSettingsContent = ({
  activeSheetSetting
}: SheetSettingsContentProps) => {

  const content = {
    COLUMN_TYPES: SheetSettingsContentColumnTypes
  }

  const ContentComponent = activeSheetSetting ? content[activeSheetSetting] : null

  return <ContentComponent />
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetSettingsContentProps {
  activeSheetSetting: TActiveSheetSetting
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetSettingsContent
