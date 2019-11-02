//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { LIGHTNING_BOLT } from '@app/assets/icons' 

import { IAppState } from '@app/state'
import { createSheetView, resetSheetView } from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
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
      <SheetViews>
        {sheetViews && sheetViews.map(sheetViewId => (
          <SheetView
            key={sheetViewId}
            sheetId={sheetId}
            sheetViewId={sheetViewId}
            closeDropdown={() => setIsDropdownVisible(false)}
            openDropdown={() => setIsDropdownVisible(true)}/>
        ))}
        <Action
          onClick={() => handleCreateSheetViewClick()}>
          New Quick View...
        </Action>
        <Action
          onClick={() => handleResetSheetViewClick()}>
          Clear...
        </Action>
      </SheetViews>
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
// Styled Components
//-----------------------------------------------------------------------------
const SheetViews = styled.div`
  padding: 5px 0;
`

const Action = styled.div`
  padding: 0.25rem 0.375rem 0.25rem 0.5rem;
  font-style: italic;
  font-size: inherit;
  color: inherit;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetView
