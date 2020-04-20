//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useSheetEditingPermissions } from '@/hooks'

import { IAppState } from '@/state'

import { createMessengerMessage } from '@/state/messenger/actions'
import {
  createSheetPriority,
  updateSheetCellPriorities
} from '@/state/sheet/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@desktop/Sheet/SheetActionButtonDropdown'
import SheetActionButtonDropdownItem from '@desktop/Sheet/SheetActionButtonDropdownItem'
import SheetActionPrioritiesPriority from '@desktop/Sheet/SheetActionPrioritiesPriority'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSheetCellPriorities = ({
  sheetId
}: ISheetActionSheetCellPriorities) => {

  // Redux
  const dispatch = useDispatch()
  const allSheetPriorities = useSelector((state: IAppState) => state.sheet.allSheetPriorities)
  const sheetPriorities = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].priorities)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ activeSheetPriorityId, setActiveSheetPriorityId ] = useState(sheetPriorities && sheetPriorities[0] ? sheetPriorities[0] : null)

  // Permissions
  const {
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Get the active sheet priority
  const activeSheetPriority = allSheetPriorities && allSheetPriorities[activeSheetPriorityId]

  // On load, set the active priority to the first sheet priority
  useEffect(() => {
    if(sheetPriorities && sheetPriorities.length > 0 && activeSheetPriorityId === null) {
      setActiveSheetPriorityId(sheetPriorities[0])
    }
  }, [ sheetPriorities ])

  // Handle Create Sheet Cell Priority
  const handleCreateSheetCellPriority = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(updateSheetCellPriorities(sheetId, activeSheetPriorityId))
    }
  }

  // Handle Create Sheet Priority
  const handleCreateSheetPriority = () => {
    if(!userHasPermissionToEditSheet) {
      setIsDropdownVisible(false)
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(createSheetPriority(sheetId))
    }
  }

  // Handle Delete Sheet Cell Priority
  const handleDeleteSheetCellPriority = () => {
    setIsDropdownVisible(false)
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      dispatch(updateSheetCellPriorities(sheetId, null))
    }
  }

  return (
    <SheetActionButton
      containerBackgroundColor={activeSheetPriority ? activeSheetPriority.backgroundColor : "rgb(225, 225, 225)"}
      containerBorderColor="rgb(210, 210, 210)"
      containerHoverBackgroundColor={userColorPrimary}
      containerColor={activeSheetPriority ? activeSheetPriority.color : undefined}
      containerHoverColor="white"
      containerWidth="5rem"
      dropdownToggleBackgroundColor={activeSheetPriority ? activeSheetPriority.backgroundColor : "rgb(225, 225, 225)"}
      dropdownToggleBorderColor="rgb(210, 210, 210)"
      dropdownToggleColor={activeSheetPriority ? activeSheetPriority.color : undefined}
      dropdownToggleHoverBackgroundColor={userColorPrimary}
      dropdownToggleHoverColor="white"
      closeDropdown={() => setIsDropdownVisible(false)}
      isDropdownVisible={isDropdownVisible}
      marginLeft="0"
      marginRight="0"
      onClick={() => handleCreateSheetCellPriority()}
      openDropdown={() => setIsDropdownVisible(true)}
      text={activeSheetPriorityId 
        ? sheetPriorities && allSheetPriorities[activeSheetPriorityId].name
          ? sheetPriorities.indexOf(activeSheetPriorityId) + 1 + '. ' + allSheetPriorities[activeSheetPriorityId].name 
          : 'Priorities'
        : sheetPriorities && sheetPriorities.length > 0
          ? sheetPriorities.length + 1 + '. No Priority' 
          : 'Priorities'
      }
      tooltip='Assign priority to a cell. Cells with priority sort to the top of any group.'>
      <SheetActionButtonDropdown>
        {sheetPriorities && sheetPriorities.map((sheetPriorityId, index) => (
          <SheetActionPrioritiesPriority
            key={sheetPriorityId}
            sheetId={sheetId}
            closeDropdown={() => setIsDropdownVisible(false)}
            isActiveSheetPriority={activeSheetPriorityId === sheetPriorityId}
            isFirst={index === 0}
            isLast={index === sheetPriorities.length - 1}
            order={index + 1}
            priority={allSheetPriorities[sheetPriorityId]}
            setActiveSheetPriorityId={setActiveSheetPriorityId}/>
        ))}
        {sheetPriorities && sheetPriorities.length > 0 &&
          <SheetActionButtonDropdownItem
            sheetId={sheetId}
            containerBackgroundColor="transparent"
            containerColor="black"
            onClick={() => handleDeleteSheetCellPriority()}
            text="No Priority"
            textPrefix={sheetPriorities.length + 1 + '. '}>
          </SheetActionButtonDropdownItem>
        }
        <SheetActionButtonDropdownItem
          isLast
          sheetId={sheetId}
          onClick={() => handleCreateSheetPriority()}
          text="Create New Priority..."
          textFontStyle="italic">
        </SheetActionButtonDropdownItem>
      </SheetActionButtonDropdown>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSheetCellPriorities {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetCellPriorities
