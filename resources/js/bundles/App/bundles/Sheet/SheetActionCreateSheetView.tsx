//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LIGHTNING_BOLT } from '@app/assets/icons' 

import { IAppState } from '@app/state'
import { createSheetView, resetSheetView } from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'
import SheetActionButtonDropdownItem from '@app/bundles/Sheet/SheetActionButtonDropdownItem'
import SheetView from '@app/bundles/Sheet/SheetActionCreateSheetViewSheetView'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheetView = ({
  sheetId
}: ISheetActionCreateSheetViewProps) => {

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
      icon={LIGHTNING_BOLT}
      isDropdownVisible={isDropdownVisible}
      marginLeft="0"
      marginRight="0.375rem"
      onClick={() => setIsDropdownVisible(true)}
      openDropdown={() => setIsDropdownVisible(true)}
      text={sheetActiveSheetViewId && allSheetViews[sheetActiveSheetViewId] && allSheetViews[sheetActiveSheetViewId].name ? allSheetViews[sheetActiveSheetViewId].name : 'Quick Views'}>
      <SheetActionButtonDropdown>
        {sheetViews && sheetViews.map(sheetViewId => (
          <SheetView
            key={sheetViewId}
            sheetId={sheetId}
            sheetViewId={sheetViewId}
            closeDropdown={() => setIsDropdownVisible(false)}
            openDropdown={() => setIsDropdownVisible(true)}/>
        ))}
        <SheetActionButtonDropdownItem
          onClick={() => handleCreateSheetViewClick()}>
          New Quick View...
        </SheetActionButtonDropdownItem>
        <SheetActionButtonDropdownItem
          onClick={() => handleResetSheetViewClick()}>
          Clear...
        </SheetActionButtonDropdownItem>
      </SheetActionButtonDropdown>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionCreateSheetViewProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetView
