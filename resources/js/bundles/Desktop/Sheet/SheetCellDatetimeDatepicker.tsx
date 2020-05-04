//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import Datepicker from '@/components/Datepicker'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetimeDatepicker = ({
  sheetId,
  handleEditing,
  value,
}: ISheetCellDatetimeDatepickerProps) => {

  // Refs
  const styledInput = useRef(null)

  // Redux
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)

  // Effects
  useEffect(() => {
    styledInput.current && styledInput.current.focus()
  }, [])

  return (
    <Container
      data-testid="SheetCellDatetimeDatepicker">
      <InputContainer>
        <StyledInput
          data-testid="SheetCellDatetimeDatepickerInput"
          ref={styledInput}
          onChange={(e: any) => handleEditing(e.target.value)}
          value={value || ''}/>
      </InputContainer>
      {sheetSelectionsRangeCellIds.size === 0 &&
        <Datepicker
          handleEditing={handleEditing}
          value={value}/>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellDatetimeDatepickerProps {
  sheetId: ISheet['id']
  handleEditing(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

const InputContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
`

const StyledInput = styled.input`
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetimeDatepicker
