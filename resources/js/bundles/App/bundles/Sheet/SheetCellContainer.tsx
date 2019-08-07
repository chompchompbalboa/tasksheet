//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellContainer = ({
  cellId,
  children,
  focusCell,
  value
}: SheetCellContainerProps) => {

  const container = useRef(null)
  const [ isEditing, setIsEditing ] = useState(localStorage.getItem('sheetCellIsEditing') === cellId)
  
  useEffect(() => {
    if(isEditing) {
      focusCell()
      window.addEventListener('mousedown', closeOnClickOutside)
      window.addEventListener('keypress', closeOnKeypressEnter)
    }
    else {
      window.removeEventListener('mousedown', closeOnClickOutside)
      window.removeEventListener('keypress', closeOnKeypressEnter)
    }
    return () => {
      window.removeEventListener('mousedown', closeOnClickOutside)
      window.removeEventListener('keypress', closeOnKeypressEnter)
    }
  }, [ isEditing ])

  const closeOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      setIsEditing(false)
      localStorage.setItem('sheetCellIsEditing', null)
    }
  }

  const closeOnKeypressEnter = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      setIsEditing(false)
      localStorage.setItem('sheetCellIsEditing', null)
    }
  }

  const openOnDoubleClick = (e: any) => {
    e.preventDefault()
    setIsEditing(true)
    localStorage.setItem('sheetCellIsEditing', cellId)
  }
  
  return (
    <Container
      ref={container}
      onDoubleClick={(e) => openOnDoubleClick(e)}>
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
  cellId: string
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
  text-overflow: ellipsis;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellContainer
