//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { BACKGROUND_COLOR, EDIT, TRASH_CAN } from '@app/assets/icons'

import { ISheet, ISheetPriority } from '@app/state/sheet/types'

import {
  deleteSheetPriority,
  updateSheetPriority,
  updateSheetCellPriorities,
  updateSheetPriorityStyle
} from '@app/state/sheet/actions'

import SheetActionButtonDropdownItem from '@app/bundles/Sheet/SheetActionButtonDropdownItem'
import SheetActionButtonDropdownItemAction from '@app/bundles/Sheet/SheetActionButtonDropdownItemAction'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionPrioritiesPriority = ({
  sheetId,
  closeDropdown,
  isActiveSheetPriority,
  order: sheetPriorityOrder,
  priority: sheetPriority,
  setActiveSheetPriorityId
}: ISheetActionPrioritiesPriority) => {

  const dispatch = useDispatch()
  const [ isSheetPriorityRenaming, setIsSheetPriorityRenaming ] = useState(sheetPriority.name === null)

  const handleSheetPriorityClick = () => {
    setActiveSheetPriorityId(sheetPriority.id)
    closeDropdown()
    dispatch(updateSheetCellPriorities(sheetId, sheetPriority.id))
  }

  const onSheetPriorityRenamingEnd = () => {
    setIsSheetPriorityRenaming(false)
    dispatch(updateSheetPriority(sheetPriority.id, {
      name: sheetPriority.name
    }))
  }

  return (
    <SheetActionButtonDropdownItem
      sheetId={sheetId}
      containerBackgroundColor={sheetPriority && sheetPriority.backgroundColor}
      containerColor={sheetPriority && sheetPriority.color}
      isFirst={sheetPriorityOrder === 1}
      isTextUpdating={isSheetPriorityRenaming}
      onClick={() => handleSheetPriorityClick()}
      onUpdateTextEnd={() => onSheetPriorityRenamingEnd()}
      text={sheetPriority.name}
      textPrefix={sheetPriorityOrder + '. '}
      textPlaceholder="New Priority..."
      updateText={nextSheetPriorityName => dispatch(updateSheetPriority(sheetPriority.id, { name: nextSheetPriorityName }, true))}>
      <SheetActionButtonDropdownItemAction
        icon={BACKGROUND_COLOR}
        iconSize="1.125rem"
        onClick={() => {
          setActiveSheetPriorityId(sheetPriority.id)
          dispatch(updateSheetPriorityStyle(sheetId, sheetPriority.id))
        }}/>
      <SheetActionButtonDropdownItemAction
        icon={EDIT}
        onClick={() => setIsSheetPriorityRenaming(true)}/>
      <SheetActionButtonDropdownItemAction
        icon={TRASH_CAN}
        isLast
        onClick={() => {
          isActiveSheetPriority && setActiveSheetPriorityId(null)
          dispatch(deleteSheetPriority(sheetId, sheetPriority.id))
        }}/>
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
  order: number
  priority: ISheetPriority
  setActiveSheetPriorityId(nextActiveSheetPriorityId: ISheetPriority['id']): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionPrioritiesPriority
