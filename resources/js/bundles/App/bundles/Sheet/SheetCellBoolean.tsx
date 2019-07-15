//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellBoolean = ({
  setCellValue,
  value
}: SheetCellBooleanProps) => {
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? '1' : '0'
    setCellValue(nextCellValue)
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
  setCellValue(nextCellValue: string): void
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
