//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellContainer = ({
  children,
  focusCell,
  value
}: SheetCellContainerProps) => {

  const container = useRef(null)
  const [ isEditing, setIsEditing ] = useState(false)
  
  useEffect(() => {
    if(isEditing) {
      focusCell()
      window.addEventListener('click', closeOnClickOutside)
    }
    else {
      window.removeEventListener('click', closeOnClickOutside)
    }
    return () => {
      window.removeEventListener('click', closeOnClickOutside)
    }
  }, [ isEditing ])

  const closeOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      setIsEditing(false)
    }
  }

  const handleDoubleClick = (e: any) => {
    e.preventDefault()
    setIsEditing(true)
  }
  
  return (
    <Container
      ref={container}
      onDoubleClick={(e) => handleDoubleClick(e)}>
        {isEditing 
          ? children
          : value === null ? " " : value}
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellContainerProps {
  children?: any
  focusCell?(): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
