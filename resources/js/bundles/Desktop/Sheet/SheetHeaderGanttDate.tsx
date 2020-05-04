//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import Datepicker from '@/components/Datepicker'
import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttDate = ({
  iconBefore,
  iconAfter,
  onDateChange,
  text
}: ISheetHeaderGanttDate) => {

  // Refs
  const container = useRef(null)

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
      ref={container}
      onClick={() => setIsDropdownVisible(true)}>
      <CurrentDateContainer>
        <CurrentDate>
          {iconBefore && <Icon icon={iconBefore}/>}
          {text}
          {iconAfter && <Icon icon={iconAfter}/>}
        </CurrentDate>
      </CurrentDateContainer>
      <Datepicker
        handleEditing={nextDate => onDateChange(nextDate)}
        isVisible={isDropdownVisible}
        value={text}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetHeaderGanttDate {
  iconBefore?: string
  iconAfter?: string
  onDateChange(nextDate: string): void
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1000;
  position: relative;
  cursor: pointer;
  color: rgb(80, 80, 80);
  height: 100%;
`

const CurrentDateContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CurrentDate = styled.div`
  border-radius: 3px;
  padding: 0 2px;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGanttDate
