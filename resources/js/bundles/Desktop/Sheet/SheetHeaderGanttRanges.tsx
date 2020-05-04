//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { LIST } from '@/assets/icons'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetGantt
} from '@/state/sheet/types'

import Icon from '@/components/Icon'
import SheetHeaderGanttRangesRange from '@desktop/Sheet/SheetHeaderGanttRangesRange'
import SheetHeaderGanttRangesCreateRange from '@desktop/Sheet/SheetHeaderGanttRangesCreateRange'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttRanges = ({
  sheetId,
  columnId,
  sheetGanttId
}: ISheetHeaderGanttRanges) => {

  // Refs
  const container = useRef(null)

  // Redux
  const sheetGanttRanges = useSelector((state: IAppState) => state.sheet.allSheets[sheetId]?.ganttRanges[sheetGanttId])

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Add event handlers when dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('click', closeDropdownOnClickOutside)
    }
    else {
      removeEventListener('click', closeDropdownOnClickOutside)
    }
    return () => removeEventListener('click', closeDropdownOnClickOutside)
  }, [ isDropdownVisible ])

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  return (
    <Container
      data-testid="SheetHeaderGanttRanges"
      ref={container}
      onClick={() => setIsDropdownVisible(true)}>
      <SheetGanttRangesDropdownButton
        data-testid="SheetHeaderGanttRangesDropdownButton">
        <Icon
          icon={LIST}
          size="0.85rem"/>
      </SheetGanttRangesDropdownButton>
      <SheetGanttRangesDropdown
        data-testid="SheetHeaderGanttRangesDropdown"
        isVisible={isDropdownVisible}>
        {sheetGanttRanges && sheetGanttRanges.map(sheetGanttRangeId => (
          <SheetHeaderGanttRangesRange
            key={sheetGanttRangeId}
            sheetId={sheetId}
            columnId={columnId}
            sheetGanttRangeId={sheetGanttRangeId}/>
        ))}
        <SheetHeaderGanttRangesCreateRange
          sheetId={sheetId}
          sheetGanttId={sheetGanttId}/>
      </SheetGanttRangesDropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetHeaderGanttRanges {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  sheetGanttId: ISheetGantt['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  height: 100%;
  margin-right: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SheetGanttRangesDropdownButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.05rem;
  border-radius: 2px;
  &:hover {
    background-color: rgb(200, 200, 200);
  }
`
const SheetGanttRangesDropdown = styled.div`
  display: ${ ({ isVisible }: ISheetGanttRanges ) => isVisible ? 'block' : 'none' };
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0.25rem;
  border-radius: 4px;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
`
interface ISheetGanttRanges {
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGanttRanges
