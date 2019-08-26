//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetCell, SheetColumnType, SheetCellUpdates, SheetColumn } from '@app/state/sheet/types'
import { selectCell } from '@app/state/sheet/selectors'

import SheetCellBoolean from '@app/bundles/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@app/bundles/Sheet/SheetCellDatetime'
import SheetCellNumber from '@app/bundles/Sheet/SheetCellNumber'
import SheetCellString from '@app/bundles/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetCellProps) => ({
  cell: selectCell(state, props.cellId)
})

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
  updateSheetSelection
}: SheetCellProps) => {
  // Refs
  const cellContainer = useRef(null)
  // Cell Value
  const [ cellValue, setCellValue ] = useState(cell ? cell.value : null)
  useEffect(() => {
    if(cellValue !== cell.value) {
      setCellValue(cell.value)
    }
  }, [ cell ])
  useEffect(() => {
    let updateSheetCellTimer: number = null
    if(cell && cellValue !== cell.value) {
      clearTimeout(updateSheetCellTimer)
      updateSheetCellTimer = setTimeout(() => {
        updateSheetCell(cell.id, { value: cellValue }, { value: cell.value })
      }, 1000)
    }
    return () => clearTimeout(updateSheetCellTimer);
  }, [ cellValue ])
  // Cell type
  const sheetCellTypes = {
    STRING: SheetCellString,
    NUMBER: SheetCellNumber,
    BOOLEAN: SheetCellBoolean,
    DATETIME: SheetCellDatetime,
  }
  const SheetCellType = sheetCellTypes[type]
  // Selections
  const handleClick = (e: MouseEvent) => {
    updateSheetSelection(cell.id, e.shiftKey)
  }
  const getContainerBoxShadow = () => {
    if(cell && cell.selectionType !== null) {
      return 'inset 0px 0px 0px 2px ' + highlightColor
    }
    return 'none'
  }
  
  return (
    <Container
      ref={cellContainer}
      containerBoxShadow={getContainerBoxShadow()}
      isSelected={cell && cell.selectionType !== null}
      onClick={handleClick}
      style={style}>
      <SheetCellType
        cellId={cell.id}
        updateCellValue={setCellValue}
        value={cellValue}/>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellProps {
  cellId: SheetColumn['id']
  cell?: SheetCell
  highlightColor: string
  sheetId: string
  style: {}
  type: SheetColumnType
  updateSheetCell(cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetSelection(cellId: string, isShiftPressed: boolean): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  border-right: 0.5px solid rgb(180, 180, 180);
  border-bottom: 0.5px solid rgb(180, 180, 180);
  box-shadow: ${ ({ containerBoxShadow }: ContainerProps ) => containerBoxShadow };
  user-select: none;
  background-color: ${ ({ isSelected }: ContainerProps ) => isSelected ? 'rgb(245, 245, 245)' : 'white' };
  overflow: hidden;
  &:hover {
    background-color: rgb(245, 245, 245);
  }
`
interface ContainerProps {
  containerBoxShadow: string
  isSelected: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetCell)
