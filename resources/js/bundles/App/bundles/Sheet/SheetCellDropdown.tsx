//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef } from 'react'
import styled from 'styled-components'

import AutosizeTextArea from 'react-autosize-textarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellDropdown = ({
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellDropdownProps) => {
  
  const textarea = useRef(null)
  
  const focusCell = () => {
    textarea.current.focus()
     // Move the cursor to the end
    const textareaLength = textarea && textarea.current && textarea.current.value && textarea.current.value.length || 0
    textarea.current.setSelectionRange(textareaLength, textareaLength)
  }
  
  const safeValue = value === null ? "" : value

  return (
    <SheetCellContainer
      focusCell={focusCell}
      updateCellValue={updateCellValue}
      value={safeValue}
      {...passThroughProps}>
      <StyledTextarea
        ref={textarea}
        onChange={(e: any) => updateCellValue(e.target.value)}
        value={safeValue}/>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellDropdownProps {
  cellId: string
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
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
  white-space: nowrap;
  text-overflow: ellipsis;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDropdown
