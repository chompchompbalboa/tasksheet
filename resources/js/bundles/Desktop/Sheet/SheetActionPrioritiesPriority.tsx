//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { EDIT, TRASH_CAN } from '@/assets/icons'

import { ISheet, ISheetPriority } from '@/state/sheet/types'

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

  const dispatch = useDispatch()
  const [ isSheetPriorityRenaming, setIsSheetPriorityRenaming ] = useState(sheetPriority.name === null)
  const [ isColorPickerVisible, setIsColorPickerVisible ] = useState(false)

  const sheetActionPrioritiesPriority = useRef(null)

  useEffect(() => {
    if(isColorPickerVisible) {
      addEventListener('mousedown', closeColorPickerOnClickOutside)
    }
    else {
      removeEventListener('mousedown', closeColorPickerOnClickOutside)
    }
    return () => removeEventListener('mousedown', closeColorPickerOnClickOutside)
  }, [ isColorPickerVisible ])

  const closeColorPickerOnClickOutside = (e: MouseEvent) => {
    if(!sheetActionPrioritiesPriority.current.contains(e.target)) {
      setIsColorPickerVisible(false)
    }
  }

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
      onUpdateTextEnd={() => onSheetPriorityRenamingEnd()}
      text={sheetPriority.name}
      textPrefix={sheetPriorityOrder + '. '}
      textPlaceholder="New Priority..."
      updateText={nextSheetPriorityName => dispatch(updateSheetPriority(sheetPriority.id, { name: nextSheetPriorityName }, true))}>
      <SheetActionPrioritiesPriorityChooseBackgroundColor
        isColorPickerVisible={isColorPickerVisible}
        setIsColorPickerVisible={setIsColorPickerVisible}
        sheetPriority={sheetPriority}/>
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
