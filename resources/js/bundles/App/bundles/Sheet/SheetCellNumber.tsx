//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef } from 'react'
import styled from 'styled-components'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellNumber = ({
  updateCellValue,
  value
}: SheetCellNumberProps) => {
  
  const input = useRef(null)
  
  const focusCell = () => {
    input.current.select()
  }
  
  const safeValue = value === null ? "" : value

  return (
    <SheetCellContainer
      focusCell={focusCell}
      value={safeValue}>
      <StyledInput
        ref={input}
        type="number"
        onChange={(e) => updateCellValue(e.target.value)}
        value={safeValue}/>
    </SheetCellContainer>
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
