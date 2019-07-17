//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Dropdown = ({
  children,
  closeDropdown,
  dropdownLeft,
  dropdownTop
}: DropdownProps) => {

  const container = useRef(null)

  useEffect(() => {
    window.addEventListener('mousedown', closeDropdownOnClickOutside)
    return () => {
      window.removeEventListener('mousedown', closeDropdownOnClickOutside)
    }
  }, [])

  const closeDropdownOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      closeDropdown()
    }
  }

  return (
    <Container
      ref={container}
      dropdownTop={dropdownTop}
      dropdownLeft={dropdownLeft}>
      {children}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface DropdownProps {
  children?: any
  closeDropdown(): void
  dropdownTop: number
  dropdownLeft: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10000;
  position: fixed;
  top: ${( { dropdownTop }: ContainerProps ) => dropdownTop + 'px'};
  left: ${( { dropdownLeft }: ContainerProps ) => dropdownLeft + 'px'};
  padding: 0.5rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 3px 3px 10px 0px rgba(150,150,150,1)
`
interface ContainerProps {
  dropdownTop: number
  dropdownLeft: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Dropdown
