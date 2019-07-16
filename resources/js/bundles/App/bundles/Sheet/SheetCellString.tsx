//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import AutosizeTextArea from 'react-autosize-textarea'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellString = ({
  updateCellValue,
  value
}: SheetCellStringProps) => {

  const textarea = useRef(null)
  const [ isEditing, setIsEditing ] = useState(false)
  
  useEffect(() => {
    if(isEditing) {
      textarea.current.select()
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
    if(!textarea.current.contains(e.target)) {
      setIsEditing(false)
    }
  }

  const handleDoubleClick = (e: any) => {
    e.preventDefault()
    setIsEditing(true)
  }

  return (
    <StyledTextarea
      ref={textarea}
      onChange={(e: any) => updateCellValue(e.target.value)}
      onDoubleClick={(e) => handleDoubleClick(e)}
      readOnly={!isEditing}
      style={{
        cursor: isEditing ? 'text' : 'default'
      }}
      value={value === null ? "" : value}/>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellStringProps {
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledTextarea = styled(AutosizeTextArea)`
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
  resize: none;
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
export default SheetCellString
