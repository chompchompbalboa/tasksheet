//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { ISheetCell } from '@/state/sheet/types'
import { ISheetCellTypesSharedProps } from '@desktop/bundles/Sheet/SheetCell'

import { updateSheetCell } from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellString = ({
  cell
}: ISheetCellTypesSharedProps) => {
  
  // Refs
  const textarea = useRef(null)
  
  // State
  const [ sheetCellPreviousValue, setSheetCellPreviousValue ] = useState(null)
  
  // Begin Editing
  const beginEditing = (nextSheetCellValue: string = null) => {
    setSheetCellPreviousValue(cell.value)
    dispatch(updateSheetCell(cell.id, { isEditing: true, value: nextSheetCellValue || cell.value } ))
    if(textarea && textarea.current) {
      const textareaLength = textarea.current.value && textarea.current.value.length || 0
      textarea.current.focus()
      textarea.current.setSelectionRange(textareaLength,textareaLength)
    }
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
      testId="SheetCellString"
      cell={cell}
      beginEditing={beginEditing}
      completeEditing={completeEditing}
      value={cell.value}>
      <StyledInput
        data-testid="SheetCellStringTextarea"
        ref={textarea}
        onChange={onValueChange}
        value={cell.value || ""}/>
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
  color: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  background-color: transparent;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellString
