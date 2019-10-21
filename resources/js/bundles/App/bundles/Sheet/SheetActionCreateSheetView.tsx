//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { STAR } from '@app/assets/icons' 

import { IAppState } from '@app/state'
import { createSheetView } from '@app/state/sheet/actions'

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

  return (
    <SheetActionButton
      closeDropdown={() => setIsDropdownVisible(false)}
      icon={STAR}
      isDropdownVisible={isDropdownVisible}
      onClick={() => handleButtonClick()}
      openDropdown={() => setIsDropdownVisible(true)}>
      {sheetViews && sheetViews.length > 0 
        ? <SheetViews>
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
            Click the star above to save the current filters, groups, and sorts for quick access later
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

const NoSheetViewsMessage = styled.div`
  padding: 0.625rem;
`
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetView
