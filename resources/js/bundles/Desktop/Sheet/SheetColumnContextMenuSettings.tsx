//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import { 
  ISheet,
  ISheetColumn
} from '@/state/sheet/types'

import ContextMenuDivider from '@desktop/ContextMenu/ContextMenuDivider'
import SheetColumnContextMenuSettingsChanges from '@desktop/Sheet/SheetColumnContextMenuSettingsChanges'
import SheetColumnContextMenuSettingsDefaultValue from '@desktop/Sheet/SheetColumnContextMenuSettingsDefaultValue'

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
