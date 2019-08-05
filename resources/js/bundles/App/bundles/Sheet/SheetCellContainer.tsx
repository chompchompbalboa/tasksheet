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
  clearTimeoutBatchedSheetCellUpdates,
  focusCell,
  value
}: SheetCellContainerProps) => {

  const container = useRef(null)
  const [ isEditing, setIsEditing ] = useState(localStorage.getItem('sheetCellIsEditing') === cellId)
  
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
      localStorage.setItem('sheetCellIsEditing', null)
    }
  }

  const handleDoubleClick = (e: any) => {
    e.preventDefault()
    setIsEditing(true)
    clearTimeoutBatchedSheetCellUpdates()
    localStorage.setItem('sheetCellIsEditing', cellId)
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
  cellId: string
  children?: any
  clearTimeoutBatchedSheetCellUpdates(): void
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
