//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useRef } from 'react'
import styled from 'styled-components'

import { ISheetCell } from '@app/state/sheet/types'

import AutosizeTextArea from 'react-autosize-textarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellString = ({
  testId,
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellStringProps) => {
  
  const textarea = useRef(null)
  
  const focusCell = () => {
    if(textarea && textarea.current) {
      const textareaLength = textarea.current.value && textarea.current.value.length || 0
      textarea.current.focus()
      textarea.current.setSelectionRange(textareaLength,textareaLength)
    }
  }
  
  const safeValue = value === null ? "" : value

  return (
    <SheetCellContainer
      testId={testId || "SheetCellString"}
      focusCell={focusCell}
      updateCellValue={updateCellValue}
      value={safeValue}
      {...passThroughProps}>
      <StyledTextarea
        data-testid="SheetCellStringTextarea"
        ref={textarea}
        onChange={(e: any) => updateCellValue(e.target.value)}
        value={safeValue}/>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellStringProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellSelected: boolean
  testId?: string
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
  color: inherit;
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
export default SheetCellString
