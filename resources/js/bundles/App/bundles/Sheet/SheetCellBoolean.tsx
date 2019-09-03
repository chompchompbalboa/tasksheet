//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { SheetColumnType } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellBoolean = ({
  cellId,
  isCellSelected,
  updateCellValue,
  updateSheetSelectedCell,
  value
}: SheetCellBooleanProps) => {
  
  useEffect(() => {
    if(isCellSelected) {
      window.addEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
    else {
      window.removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
    return () => {
      window.removeEventListener('keydown', handleKeydownWhileCellIsSelected)
    }
  }, [ isCellSelected ])

  const handleKeydownWhileCellIsSelected = (e: KeyboardEvent) => {
    e.preventDefault()
    // Otherwise, navigate to an adjacent cell on an arrow or enter press
    if(e.key === 'Enter' || e.key === 'ArrowDown') {
      updateSheetSelectedCell(cellId, 'DOWN')
    }
    if(e.key === 'Tab' || e.key === 'ArrowRight') {
      updateSheetSelectedCell(cellId, 'RIGHT')
    }
    if(e.key === 'ArrowLeft') {
      updateSheetSelectedCell(cellId, 'LEFT')
    }
    if(e.key === 'ArrowUp') {
      updateSheetSelectedCell(cellId, 'UP')
    }
  }
  
  const handleChange = (checked: boolean) => {
    const nextCellValue = checked ? '1' : '0'
    updateCellValue(nextCellValue)
  }
  
  return (
    <StyledInput 
       type="checkbox"
       checked={value && ['1', 'TRUE', 'true'].includes(value)}
       onChange={(e) => handleChange(e.target.checked)}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellBooleanProps {
  cellId: string
  columnType: SheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
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
