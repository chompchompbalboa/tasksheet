//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, useEffect, useRef, useState } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { SheetCellUpdates } from '@app/state/sheet/actions'
import { Cell, ColumnType } from '@app/state/sheet/types'

import SheetCellBoolean from '@app/bundles/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@app/bundles/Sheet/SheetCellDatetime'
import SheetCellNumber from '@app/bundles/Sheet/SheetCellNumber'
import SheetCellString from '@app/bundles/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCell = memo(({
  cell,
  highlightColor,
  sheetId,
  style,
  type,
  updateSheetCell,
}: SheetCellProps) => {
  
  const cellContainer = useRef(null)
  const [ cellValue, setCellValue ] = useState(cell ? cell.value : null)
  const [ isHighlighted, setIsHighlighted ] = useState(false)
  
  useEffect(() => {
    if(isHighlighted) {
      window.addEventListener('mousedown', removeHighlightOnClickOutisde)
    }
    else {
      window.removeEventListener('mousedown', removeHighlightOnClickOutisde)
    }
    return () => {
      window.removeEventListener('mousedown', removeHighlightOnClickOutisde)
    }
  }, [ isHighlighted ])

  const handleClick = (e: MouseEvent) => {
    setIsHighlighted(true)
  }

  const removeHighlightOnClickOutisde = (e: Event) => {
    if(!cellContainer.current.contains(e.target)) {
      setIsHighlighted(false)
    }
  }

  useEffect(() => {
    let updateSheetCellTimer: number = null
    if(cell && cellValue !== cell.value) {
      clearTimeout(updateSheetCellTimer)
      updateSheetCellTimer = setTimeout(() => {
        updateSheetCell(sheetId, cell.id, { value: cellValue })
      }, 1000);
    }
    return () => clearTimeout(updateSheetCellTimer);
  }, [ cellValue ])
  
  const sheetCellTypes = {
    STRING: SheetCellString,
    NUMBER: SheetCellNumber,
    BOOLEAN: SheetCellBoolean,
    DATETIME: SheetCellDatetime,
  }
  
  const SheetCellType = sheetCellTypes[type]
  return (
    <Container
      ref={cellContainer}
      highlightColor={highlightColor}
      isHighlighted={isHighlighted}
      onClick={handleClick}
      style={style}>
      <SheetCellType
        updateCellValue={setCellValue}
        value={cellValue}/>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellProps {
  cell: Cell
  highlightColor: string
  sheetId: string
  style: {}
  type: ColumnType
  updateSheetCell(sheetId: string, cellId: string, updates: SheetCellUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  border: 0.5px solid rgb(180, 180, 180);
  border-left: none;
  box-shadow: ${ ({ highlightColor, isHighlighted }: ContainerProps ) => isHighlighted ? 'inset 0px 0px 0px 2px ' + highlightColor : 'none' };
  user-select: none;
`
interface ContainerProps {
  highlightColor: string
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCell
