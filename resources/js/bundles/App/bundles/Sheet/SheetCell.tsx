//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetCell, SheetColumnType, SheetCellUpdates, SheetColumn } from '@app/state/sheet/types'
import { selectCell } from '@app/state/sheet/selectors'

import SheetCellBoolean from '@app/bundles/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@app/bundles/Sheet/SheetCellDatetime'
import SheetCellDropdown from '@app/bundles/Sheet/SheetCellDropdown'
import SheetCellFiles from '@app/bundles/Sheet/SheetCellFiles'
import SheetCellNumber from '@app/bundles/Sheet/SheetCellNumber'
import SheetCellPhotos from '@app/bundles/Sheet/SheetCellPhotos'
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
  sheetId,
  cell,
  columnType,
  highlightColor,
  style,
  updateSheetCell,
  updateSheetSelectedCell,
  updateSheetSelection,
  updateSheetSelectionOnCellMountOrUnmount
}: SheetCellProps) => {
  // Refs
  const cellContainer = useRef(null)
  // Cell Value
  const [ cellValue, setCellValue ] = useState(cell ? cell.value : null)
  useEffect(() => {
    if(cellValue !== cell.value) {
      setCellValue(cell.value)
    }
  }, [ cell && cell.value ])
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
    DROPDOWN: SheetCellDropdown,
    PHOTOS: SheetCellPhotos,
    FILES: SheetCellFiles
  }
  const SheetCellType = sheetCellTypes[columnType.cellType]
  // Selections
  const handleClick = (e: MouseEvent) => {
    updateSheetSelection(cell.id, e.shiftKey)
  }
  const getContainerBoxShadow = () => {
    if(cell && (cell.isCellSelected || cell.isRangeStart)) { return 'inset 0px 0px 0px 2px ' + highlightColor }
    return 'none'
  }
  useLayoutEffect(() => {
    if(cell.isRangeStart || cell.isRangeEnd || cell.isCellSelected) { updateSheetSelectionOnCellMountOrUnmount(cell.id, 'MOUNT') }
  }, [])
  useLayoutEffect(() => {
    return () => { if(cell.isRangeStart || cell.isRangeEnd || cell.isCellSelected) { updateSheetSelectionOnCellMountOrUnmount(cell.id, 'UNMOUNT') }}
  }, [ (cell.isCellSelected || cell.isRangeStart), cell.isRangeEnd ])
  
  return (
    <>
      <Container
        ref={cellContainer}
        containerBoxShadow={getContainerBoxShadow()}
        isCellSelected={cell.isCellSelected || cell.isRangeStart}
        isRangeSelected={(cell.isRangeStart || cell.isRangeEnd) && !cell.isRangeRenderedFromOtherEnd}
        onClick={handleClick}
        style={style}>
        <SheetCellType
          sheetId={sheetId}
          cell={cell}
          cellId={cell.id}
          columnType={columnType}
          isCellSelected={cell.isCellSelected || cell.isRangeStart}
          updateCellValue={setCellValue}
          updateSheetSelectedCell={updateSheetSelectedCell}
          value={cellValue}/>
      </Container>
    </>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellProps {
  sheetId: string
  cellId: SheetColumn['id']
  cell?: SheetCell
  columnType: SheetColumnType
  highlightColor: string
  style: {
    width?: ReactText
  }
  updateSheetCell(cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  updateSheetSelection(cellId: string, isShiftPressed: boolean): void
  updateSheetSelectionOnCellMountOrUnmount(cellId: string, mountOrUnmount: 'MOUNT' | 'UNMOUNT'): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isCellSelected, isRangeSelected }: ContainerProps ) => isCellSelected || isRangeSelected ? '10' : '5' };
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  border-right: 0.5px solid rgb(180, 180, 180);
  border-bottom: 0.5px solid rgb(180, 180, 180);
  box-shadow: ${ ({ containerBoxShadow }: ContainerProps ) => containerBoxShadow };
  user-select: none;
  background-color: ${ ({ isCellSelected, isRangeSelected }: ContainerProps ) => isCellSelected && !isRangeSelected ? 'rgb(245, 245, 245)' : 'white' };
  overflow: ${ ({ isCellSelected, isRangeSelected }: ContainerProps ) => isCellSelected || isRangeSelected ? 'visible' : 'hidden' };
  &:hover {
    background-color: ${ ({ isRangeSelected }: ContainerProps ) => !isRangeSelected ? 'rgb(245, 245, 245)' : 'white' };
  }
`
interface ContainerProps {
  containerBoxShadow: string
  isCellSelected: boolean
  isRangeSelected: boolean
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetCell)
