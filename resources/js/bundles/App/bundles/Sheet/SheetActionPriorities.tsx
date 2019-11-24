//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'

import {
  createSheetPriority,
  updateSheetCellPriorities
} from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'
import SheetActionButtonDropdownItem from '@app/bundles/Sheet/SheetActionButtonDropdownItem'
import SheetActionPrioritiesPriority from '@app/bundles/Sheet/SheetActionPrioritiesPriority'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSheetCellPriorities = ({
  sheetId
}: ISheetActionSheetCellPriorities) => {

  const dispatch = useDispatch()
  const allSheetPriorities = useSelector((state: IAppState) => state.sheet.allSheetPriorities)
  const sheetPriorities = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].priorities)

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ activeSheetPriorityId, setActiveSheetPriorityId ] = useState(sheetPriorities && sheetPriorities[0] ? sheetPriorities[0] : null)

  const activeSheetPriority = allSheetPriorities && allSheetPriorities[activeSheetPriorityId]

  useEffect(() => {
    if(sheetPriorities && sheetPriorities.length > 0 && activeSheetPriorityId === null) {
      setActiveSheetPriorityId(sheetPriorities[0])
    }
  }, [ sheetPriorities ])

  return (
    <SheetActionButton
      containerBackgroundColor={activeSheetPriority ? activeSheetPriority.backgroundColor : undefined}
      containerColor={activeSheetPriority ? activeSheetPriority.color : undefined}
      closeDropdown={() => setIsDropdownVisible(false)}
      isDropdownVisible={isDropdownVisible}
      marginLeft="0"
      marginRight="0"
      onClick={() => dispatch(updateSheetCellPriorities(sheetId, activeSheetPriorityId))}
      openDropdown={() => setIsDropdownVisible(true)}
      text={activeSheetPriorityId 
        ? sheetPriorities && allSheetPriorities[activeSheetPriorityId].name
          ? sheetPriorities.indexOf(activeSheetPriorityId) + 1 + '. ' + allSheetPriorities[activeSheetPriorityId].name 
          : 'Priorities'
        : sheetPriorities && sheetPriorities.length > 0
          ? sheetPriorities.length + 1 + '. No Priority' 
          : 'Priorities'
      }
      tooltip='Assign priority to a cell'>
      <SheetActionButtonDropdown>
        {sheetPriorities && sheetPriorities.map((sheetPriorityId, index) => (
          <SheetActionPrioritiesPriority
            key={sheetPriorityId}
            sheetId={sheetId}
            closeDropdown={() => setIsDropdownVisible(false)}
            isActiveSheetPriority={activeSheetPriorityId === sheetPriorityId}
            order={index + 1}
            priority={allSheetPriorities[sheetPriorityId]}
            setActiveSheetPriorityId={setActiveSheetPriorityId}/>
        ))}
        {sheetPriorities && sheetPriorities.length > 0 &&
          <SheetActionButtonDropdownItem
            sheetId={sheetId}
            containerBackgroundColor="transparent"
            containerColor="black"
            isLast
            onClick={() => {
              setIsDropdownVisible(false)
              dispatch(updateSheetCellPriorities(sheetId, null))
            }}
            text="No Priority"
            textPrefix={sheetPriorities.length + 1 + '. '}>
          </SheetActionButtonDropdownItem>
        }
        <SheetActionButtonDropdownItem
          sheetId={sheetId}
          onClick={() => dispatch(createSheetPriority(sheetId))}
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
// Styled Components
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetCellPriorities
