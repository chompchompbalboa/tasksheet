//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ContextMenu from '@app/bundles/ContextMenu/ContextMenu'
import ContextMenuDivider from '@app/bundles/ContextMenu/ContextMenuDivider'
import ContextMenuItem from '@app/bundles/ContextMenu/ContextMenuItem'

import { IAppState } from '@app/state'
import { ISheet, ISheetRow } from '@app/state/sheet/types'
import { 
  deleteSheetRows
} from '@app/state/sheet/actions'

import SheetRowContextMenuCreateRows from '@app/bundles/Sheet/SheetRowContextMenuCreateRows'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetRowContextMenu = ({
  sheetId,
  rowId,
  closeContextMenu,
  contextMenuLeft,
  contextMenuTop,
}: ISheetRowContextMenuProps) => {
  
  const dispatch = useDispatch()
  const sheetSelectionRangeStartRowId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections && state.sheet.allSheets[sheetId].selections.rangeStartRowId )
  const sheetSelectionRangeEndRowId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections && state.sheet.allSheets[sheetId].selections.rangeEndRowId )

  const closeOnClick = (andCallThis: (...args: any) => void) => {
    closeContextMenu()
    andCallThis()
  }
  
  const isMultipleRowsSelected = sheetSelectionRangeEndRowId !== null && sheetSelectionRangeStartRowId !== sheetSelectionRangeEndRowId
  
  return (
    <ContextMenu
      testId="SheetRowContextMenu"
      closeContextMenu={closeContextMenu}
      contextMenuTop={contextMenuTop}
      contextMenuLeft={contextMenuLeft}>
      <SheetRowContextMenuCreateRows
        sheetId={sheetId}
        sheetRowId={rowId}
        aboveOrBelow='ABOVE'
        closeOnClick={closeOnClick}/>
      <SheetRowContextMenuCreateRows
        sheetId={sheetId}
        sheetRowId={rowId}
        aboveOrBelow='BELOW'
        closeOnClick={closeOnClick}/>
      <ContextMenuDivider />
      <ContextMenuItem 
        text={"Delete " + (isMultipleRowsSelected ? "rows" : "row")}
        onClick={() => closeOnClick(() => dispatch(deleteSheetRows(sheetId, rowId)))}/>
    </ContextMenu>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetRowContextMenuProps {
  sheetId: ISheet['id']
  rowId: ISheetRow['id']
  closeContextMenu(): void
  contextMenuLeft: number
  contextMenuTop: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowContextMenu
