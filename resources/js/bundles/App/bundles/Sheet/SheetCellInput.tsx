//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, forwardRef } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellInput = forwardRef(({
  onChange,
  value,
  testId
}: SheetCellInputProps, ref: any) => (
    <StyledInput
      data-testid={testId}
      ref={ref}
      onChange={onChange}
      value={value || ''}/>
))

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellInputProps {
  onChange(e: FormEvent): void
  value: string
  testId?: string
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
  resize: none;
  white-space: nowrap;
  text-overflow: ellipsis;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellInput
