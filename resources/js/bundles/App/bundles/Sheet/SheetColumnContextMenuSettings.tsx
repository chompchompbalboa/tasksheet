//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
//import { useDispatch, useSelector } from 'react-redux'

//import { IAppState } from '@app/state'
import { 
  ISheet,
  ISheetColumn
} from '@app/state/sheet/types'

import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'
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
    <ContextMenuItem
      testId="SheetColumnContextMenuSettings"
      text="Settings">
      <SheetColumnContextMenuSettingsDefaultValue
        sheetId={sheetId}
        columnId={columnId}/>
      <SheetColumnContextMenuSettingsChanges
        columnId={columnId}/>
    </ContextMenuItem>
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
