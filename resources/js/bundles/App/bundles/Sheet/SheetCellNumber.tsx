//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellNumber = ({
  updateCellValue,
  value
}: SheetCellNumberProps) => {

  const input = useRef(null)
  const [ isEditing, setIsEditing ] = useState(false)
  
  useEffect(() => {
    if(isEditing) {
      input.current.select()
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
    if(!input.current.contains(e.target)) {
      setIsEditing(false)
    }
  }

  const handleDoubleClick = (e: any) => {
    e.preventDefault()
    setIsEditing(true)
  }

  if (isEditing) {
    return (
      <StyledInput
        ref={input}
        autoFocus
        type="number"
        onChange={(e) => updateCellValue(e.target.value)}
        value={value === null ? "" : value}/>
    )
  }
  return (
    <Container
      onDoubleClick={(e) => handleDoubleClick(e)}>
      {value}
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellNumberProps {
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
`

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellNumber
