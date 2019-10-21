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
  
  const sheetViews = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].views)
  
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  const handleButtonClick = () => {
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
      onClick={() => handleButtonClick()}
      openDropdown={() => setIsDropdownVisible(true)}>
      {sheetViews && sheetViews.length > 0 
        ? <SheetViews>
            <ResetSheetView
              onClick={() => handleResetSheetViewClick()}>
              Clear all...
            </ResetSheetView>
            {sheetViews.map(sheetViewId => (
              <SheetView
                key={sheetViewId}
                sheetId={sheetId}
                sheetViewId={sheetViewId}
                closeDropdown={() => setIsDropdownVisible(false)}
                openDropdown={() => setIsDropdownVisible(true)}/>
            ))}
          </SheetViews>
        : <NoSheetViewsMessage>
            Click the lightning bolt to save the current filters, groups, and sorts for quick access later
          </NoSheetViewsMessage>
      }
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

const ResetSheetView = styled.div`
  padding: 0.25rem 0.375rem 0.25rem 0.5rem;
  font-style: italic;
  font-size: inherit;
  color: inherit;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

const NoSheetViewsMessage = styled.div`
  padding: 0.625rem;
`
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetView
