//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellBoolean = ({
  updateCellValue,
  value
}: SheetCellBooleanProps) => {
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? '1' : '0'
    updateCellValue(nextCellValue)
  }
  
  return (
    <StyledInput 
       type="checkbox"
       checked={![null, '0'].includes(value)}
       onChange={(e) => handleChange(e.target.checked)}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellBooleanProps {
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledInput = styled.input`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellBoolean
