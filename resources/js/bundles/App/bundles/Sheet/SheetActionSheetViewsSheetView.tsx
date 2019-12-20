//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { EDIT, TRASH_CAN } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet, ISheetView } from '@app/state/sheet/types'
import { 
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  deleteSheetView,
  loadSheetView,
  updateSheetView 
} from '@app/state/sheet/actions'

import SheetActionButtonDropdownItem from '@app/bundles/Sheet/SheetActionButtonDropdownItem'
import SheetActionButtonDropdownItemAction from '@app/bundles/Sheet/SheetActionButtonDropdownItemAction'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSheetViewsSheetView = ({
  sheetId,
  sheetViewId,
  closeDropdown,
  isFirst
}: ISheetActionSheetViewsSheetViewProps) => {

  const dispatch = useDispatch()
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetView = useSelector((state: IAppState) => state.sheet.allSheetViews && state.sheet.allSheetViews[sheetViewId])
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const [ isSheetViewRenaming, setIsSheetViewRenaming ] = useState(sheetView.name === null)
  
  const isActiveSheetView = sheetView.id === sheetActiveSheetViewId

  const handleSheetViewNameClick = () => {
    closeDropdown()
    dispatch(loadSheetView(sheetId, sheetView.id))
  }

  const handleSheetViewRenamingStart = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  const handleSheetViewRenamingEnd = () => {
    setIsSheetViewRenaming(false)
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
    dispatch(updateSheetView(sheetViewId, { name: sheetView.name }))
  }

  return (
    <SheetActionButtonDropdownItem
      sheetId={sheetId}
      containerBackgroundColor={isActiveSheetView ? userColorPrimary : 'transparent'}
      containerColor={isActiveSheetView ? 'white' : 'black'}
      isFirst={isFirst}
      isTextUpdating={isSheetViewRenaming}
      onClick={() => handleSheetViewNameClick()}
      onUpdateTextStart={() => handleSheetViewRenamingStart()}
      onUpdateTextEnd={() => handleSheetViewRenamingEnd()}
      text={sheetView.name}
      textPlaceholder="New View..."
      updateText={nextSheetViewName => dispatch(updateSheetView(sheetView.id, { name: nextSheetViewName }, true))}>
      {!isActiveSheetView && 
        <>
          <SheetActionButtonDropdownItemAction
            icon={EDIT}
            onClick={() => setIsSheetViewRenaming(true)}/>
          <SheetActionButtonDropdownItemAction
            icon={TRASH_CAN}
            isLast
            onClick={() => dispatch(deleteSheetView(sheetId, sheetViewId))}/>
        </>
      }
    </SheetActionButtonDropdownItem>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSheetViewsSheetViewProps {
  sheetId: ISheet['id']
  sheetViewId: ISheetView['id'],
  closeDropdown(): void
  isFirst: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetViewsSheetView