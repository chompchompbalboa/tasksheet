//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef } from 'react'
import styled from 'styled-components'

import { ISheetCell} from '@/state/sheet/types'
import { ISheetCellTypesSharedProps } from '@desktop/bundles/Sheet/SheetCell'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellNumber = ({
  cell
}: ISheetCellTypesSharedProps) => {
  
  // Refs
  const input = useRef(null)
  
  // State
  const [ sheetCellPreviousValue, setSheetCellPreviousValue ] = useState(null)
  
  // Begin Editing
  const beginEditing = (nextSheetCellValue: string = null) => {
    input.current && input.current.focus()
    setSheetCellPreviousValue(cell.value)
    dispatch(updateSheetCell(cell.id, { isEditing: true, value: nextSheetCellValue || cell.value } ))
  }
  
  // Complete Editing
  const completeEditing = () => {
    dispatch(updateSheetCell(cell.id, { isEditing: false }, null, true))
    setTimeout(() => {
      dispatch(updateSheetCell(cell.id, { value: e.target.value }, { value: sheetCellPreviousValue }))
    }, 25)
  }
  
  // On Value Change
  const onValueChange = (e: any) => {
    dispatch(updateSheetCell(cell.id, { value: e.target.value }, null, true))
  }

  return (
    <SheetCellContainer
      testId="SheetCellNumber"
      cell={cell}
      beginEditing={beginEditing}
      completeEditing={completeEditing}
      value={cell.value}>
      <StyledInput
        data-testid="SheetCellNumberInput"
        ref={input}
        type="number"
        onChange={onValueChange}
        value={cell.value || ''}/>
    </SheetCellContainer>
  )
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
