//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { EDIT, TRASH_CAN } from '@/assets/icons'

import { useSheetEditingPermissions } from '@/hooks'

import { ISheet, ISheetPriority } from '@/state/sheet/types'

import { createMessengerMessage } from '@/state/messenger/actions'
import {
  deleteSheetPriority,
  updateSheetPriority,
  updateSheetCellPriorities
} from '@/state/sheet/actions'

import SheetActionButtonDropdownItem from '@desktop/Sheet/SheetActionButtonDropdownItem'
import SheetActionButtonDropdownItemAction from '@desktop/Sheet/SheetActionButtonDropdownItemAction'
import SheetActionPrioritiesPriorityChooseBackgroundColor from '@desktop/Sheet/SheetActionPrioritiesPriorityChooseBackgroundColor'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionPrioritiesPriority = ({
  sheetId,
  closeDropdown,
  isActiveSheetPriority,
  isFirst,
  isLast,
  order: sheetPriorityOrder,
  priority: sheetPriority,
  setActiveSheetPriorityId
}: ISheetActionPrioritiesPriority) => {

  // Refs
  const sheetActionPrioritiesPriority = useRef(null)

  // Redux
  const dispatch = useDispatch()

  // State
  const [ isSheetPriorityRenaming, setIsSheetPriorityRenaming ] = useState(sheetPriority.name === null)
  const [ isColorPickerVisible, setIsColorPickerVisible ] = useState(false)
  const [ sheetPriorityName, setSheetPriorityName ] = useState(sheetPriority.name)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Add the event listeners to close the color picker dropdown on click outside
  useEffect(() => {
    if(isColorPickerVisible) {
      addEventListener('mousedown', closeColorPickerOnClickOutside)
    }
    else {
      removeEventListener('mousedown', closeColorPickerOnClickOutside)
    }
    return () => removeEventListener('mousedown', closeColorPickerOnClickOutside)
  }, [ isColorPickerVisible ])

  // Close the color picker on click outside
  const closeColorPickerOnClickOutside = (e: MouseEvent) => {
    if(!sheetActionPrioritiesPriority.current.contains(e.target)) {
      setIsColorPickerVisible(false)
    }
  }

  // Handle Set Color Picker Visible
  const handleSetColorPickerVisible = () => {
    if(!userHasPermissionToEditSheet) {
      closeDropdown()
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setIsColorPickerVisible(true)
    }
  }

  // Handle Sheet Priority Click
  const handleSheetPriorityClick = () => {
    closeDropdown()
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setActiveSheetPriorityId(sheetPriority.id)
      dispatch(updateSheetCellPriorities(sheetId, sheetPriority.id))
    }
  }

  // Handle Sheet Priority Delete
  const handleSheetPriorityDelete = () => {
    if(!userHasPermissionToEditSheet) {
      closeDropdown()
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      isActiveSheetPriority && setActiveSheetPriorityId(null)
      dispatch(deleteSheetPriority(sheetId, sheetPriority.id))
    }
  }

  // Handle Sheet Priority Renaming Click
  const handleSheetPriorityRenamingClick = () => {
    if(!userHasPermissionToEditSheet) {
      closeDropdown()
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      setIsSheetPriorityRenaming(true)
    }
  }

  // Handle Sheet Priority Renaming End
  const handleSheetPriorityRenamingEnd = () => {
    setIsSheetPriorityRenaming(false)
    dispatch(updateSheetPriority(sheetPriority.id, {
      name: sheetPriorityName
    }))
  }

  return (
    <SheetActionButtonDropdownItem
      ref={sheetActionPrioritiesPriority}
      sheetId={sheetId}
      containerBackgroundColor={sheetPriority && sheetPriority.backgroundColor}
      containerHoverBackgroundColor={isColorPickerVisible ? sheetPriority.backgroundColor : null}
      containerColor={sheetPriority && sheetPriority.color}
      containerHoverColor={isColorPickerVisible ? 'black' : 'white'}
      isFirst={isFirst}
      isLast={isLast}
      isTextUpdating={isSheetPriorityRenaming}
      onClick={() => handleSheetPriorityClick()}
      onUpdateTextEnd={() => handleSheetPriorityRenamingEnd()}
      text={sheetPriorityName}
      textPrefix={sheetPriorityOrder + '. '}
      textPlaceholder="New Priority..."
      updateText={nextSheetPriorityName => setSheetPriorityName(nextSheetPriorityName)}>
      <SheetActionPrioritiesPriorityChooseBackgroundColor
        sheetId={sheetId}
        isColorPickerVisible={isColorPickerVisible}
        setIsColorPickerVisible={handleSetColorPickerVisible}
        sheetPriority={sheetPriority}/>
      <SheetActionButtonDropdownItemAction
        icon={EDIT}
        onClick={() => handleSheetPriorityRenamingClick()}/>
      <SheetActionButtonDropdownItemAction
        icon={TRASH_CAN}
        isLast
        onClick={() => handleSheetPriorityDelete()}/>
    </SheetActionButtonDropdownItem>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionPrioritiesPriority {
  sheetId: ISheet['id']
  closeDropdown(): void
  isActiveSheetPriority: boolean
  isFirst: boolean
  isLast: boolean
  order: number
  priority: ISheetPriority
  setActiveSheetPriorityId(nextActiveSheetPriorityId: ISheetPriority['id']): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionPrioritiesPriority
