//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'
import { createSheetView, resetSheetView } from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'
import SheetActionButtonDropdownItem from '@app/bundles/Sheet/SheetActionButtonDropdownItem'
import SheetActionSheetViewsSheetView from '@app/bundles/Sheet/SheetActionSheetViewsSheetView'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSheetViews = ({
  sheetId
}: ISheetActionSheetViewsProps) => {

  const dispatch = useDispatch()
  
  const allSheetViews = useSelector((state: IAppState) => state.sheet.allSheetViews)
  const sheetActiveSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  const sheetViews = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].views)
  
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  const handleCreateSheetViewClick = () => {
    setIsDropdownVisible(true)
    dispatch(createSheetView(sheetId))
  }
  
  const handleResetSheetViewClick = () => {
    setIsDropdownVisible(false)
    dispatch(resetSheetView(sheetId))
  }

  return (
    <SheetActionButton
      closeDropdown={() => setIsDropdownVisible(false)}
      isDropdownVisible={isDropdownVisible}
      onClick={() => setIsDropdownVisible(true)}
      openDropdown={() => setIsDropdownVisible(true)}
      text={sheetActiveSheetViewId && allSheetViews[sheetActiveSheetViewId] && allSheetViews[sheetActiveSheetViewId].name ? allSheetViews[sheetActiveSheetViewId].name : 'Views'}
      tooltip="Create new views and switch between your existing views">
      <SheetActionButtonDropdown>
        {sheetViews && sheetViews.map((sheetViewId, index) => (
          <SheetActionSheetViewsSheetView
            key={sheetViewId}
            sheetId={sheetId}
            sheetViewId={sheetViewId}
            closeDropdown={() => setIsDropdownVisible(false)}
            isFirst={index === 0}/>
        ))}
        <SheetActionButtonDropdownItem
          sheetId={sheetId}
          onClick={() => handleCreateSheetViewClick()}
          text="Create New View..."
          textFontStyle="italic"/>
        <SheetActionButtonDropdownItem
          isLast
          sheetId={sheetId}
          onClick={() => handleResetSheetViewClick()}
          text="Reset Current View..."
          textFontStyle="italic"/>
      </SheetActionButtonDropdown>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSheetViewsProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSheetViews
