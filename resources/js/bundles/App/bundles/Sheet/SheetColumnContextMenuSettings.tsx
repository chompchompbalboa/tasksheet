//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { 
  ISheet,
  ISheetColumn
} from '@app/state/sheet/types'

import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import SheetColumnContextMenuSettingsChanges from '@app/bundles/Sheet/SheetColumnContextMenuSettingsChanges'
import SheetColumnContextMenuSettingsDefaultValue from '@app/bundles/Sheet/SheetColumnContextMenuSettingsDefaultValue'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuSettings = ({
  sheetId,
  columnId,
}: ISheetColumnContextMenuSettingsProps) => {

  return (
    <>
      <ContextMenuDivider />
      <SheetColumnContextMenuSettingsDefaultValue
        sheetId={sheetId}
        columnId={columnId}/>
      <ContextMenuDivider />
      <SheetColumnContextMenuSettingsChanges
        columnId={columnId}/>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuSettingsProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuSettings
