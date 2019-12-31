//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef } from 'react'
import styled from 'styled-components'

import { ISheetCell} from '@/state/sheet/types'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellNumber = ({
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellNumberProps) => {
  
  const input = useRef(null)
  
  const focusCell = () => {
    input.current.focus()
  }
  
  const safeValue = value === null ? "" : value

  return (
    <SheetCellContainer
      testId="SheetCellNumber"
      focusCell={focusCell}
      value={safeValue}
      {...passThroughProps}>
      <StyledInput
        data-testid="SheetCellNumberInput"
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
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellInRange: boolean
  isCellSelected: boolean
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
