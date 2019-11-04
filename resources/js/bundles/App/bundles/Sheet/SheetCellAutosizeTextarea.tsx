//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent } from 'react'
import styled from 'styled-components'


import AutosizeTextArea from 'react-autosize-textarea'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellString = ({
  ref,
  onChange,
  value,
  testId
}: SheetCellStringProps) => (
    <StyledTextarea
      data-testid={testId}
      ref={ref}
      onChange={onChange}
      value={value || ''}/>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellStringProps {
  ref?: any
  onChange(e: FormEvent): void
  value: string
  testId?: string
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
export default SheetCellString
