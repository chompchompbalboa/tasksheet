//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { EDIT, TRASH_CAN } from '@app/assets/icons'

import { ISheet, ISheetPriority } from '@app/state/sheet/types'

import {
  deleteSheetPriority,
  updateSheetPriority,
  updateSheetCellPriorities
} from '@app/state/sheet/actions'

import SheetActionButtonDropdownItem from '@app/bundles/Sheet/SheetActionButtonDropdownItem'
import SheetActionButtonDropdownItemAction from '@app/bundles/Sheet/SheetActionButtonDropdownItemAction'
import SheetActionPrioritiesPriorityChooseBackgroundColor from '@app/bundles/Sheet/SheetActionPrioritiesPriorityChooseBackgroundColor'

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
      isFirst={sheetPriorityOrder === 1}
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
  order: number
  priority: ISheetPriority
  setActiveSheetPriorityId(nextActiveSheetPriorityId: ISheetPriority['id']): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionPrioritiesPriority
