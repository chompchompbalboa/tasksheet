//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetCell, SheetColumnType, SheetCellUpdates, SheetColumn } from '@app/state/sheet/types'

import SheetCellBoolean from '@app/bundles/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@app/bundles/Sheet/SheetCellDatetime'
import SheetCellDropdown from '@app/bundles/Sheet/SheetCellDropdown'
import SheetCellFiles from '@app/bundles/Sheet/SheetCellFiles'
import SheetCellNumber from '@app/bundles/Sheet/SheetCellNumber'
import SheetCellPhotos from '@app/bundles/Sheet/SheetCellPhotos'
import SheetCellString from '@app/bundles/Sheet/SheetCellString'


//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCell = memo(({
  sheetId,
  cellId,
  columnType,
  highlightColor,
  style,
  updateSheetCell,
  updateSheetSelectionFromArrowKey,
  updateSheetSelectionFromCellClick
}: SheetCellProps) => {

  // Redux
  const cell = useSelector((state: AppState) => state.sheet.cells[cellId])
  const sheetSelectionsRangeCellIds = useSelector((state: AppState) => state.sheet.sheets[sheetId].selections.rangeCellIds)
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
  const isCellSelected = cell.isCellSelected
  const isCellInRange = sheetSelectionsRangeCellIds.has(cellId)
  const handleClick = (e: MouseEvent) => {
    updateSheetSelectionFromCellClick(cell.id, e.shiftKey)
  }
  
  return (
    <>
      <Container
        ref={cellContainer}
        cellId={cellId}
        highlightColor={highlightColor}
        isCellSelected={isCellSelected}
        isCellInRange={isCellInRange}
        onClick={handleClick}
        style={style}>
        <SheetRange
          isCellInRange={isCellInRange}
          highlightColor={highlightColor}/>
        <SheetCellType
          sheetId={sheetId}
          cell={cell}
          cellId={cell.id}
          columnType={columnType}
          isCellSelected={cell.isCellSelected}
          updateCellValue={setCellValue}
          updateSheetSelectionFromArrowKey={updateSheetSelectionFromArrowKey}
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
  columnType: SheetColumnType
  highlightColor: string
  style: {
    width?: ReactText
  }
  updateSheetCell(cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetSelectionFromArrowKey(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  updateSheetSelectionFromCellClick(cellId: string, isShiftPressed: boolean): void
  updateSheetSelectionOnCellMountOrUnmount(cellId: string, mountOrUnmount: 'MOUNT' | 'UNMOUNT'): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isCellSelected, isCellInRange }: IContainer ) => isCellSelected || isCellInRange ? '10' : '5' };
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  border-right: 0.5px solid rgb(180, 180, 180);
  border-bottom: 0.5px solid rgb(180, 180, 180);
  box-shadow: ${ ({ isCellSelected, highlightColor }: IContainer ) => isCellSelected ? 'inset 0px 0px 0px 2px ' + highlightColor : 'none' };
  user-select: none;
  background-color: ${ ({ isCellSelected, isCellInRange, highlightColor }: IContainer ) => isCellSelected ? 'rgb(245, 245, 245)' : 'white' };
  overflow: ${ ({ isCellSelected, isCellInRange }: IContainer ) => isCellSelected || isCellInRange ? 'visible' : 'hidden' };
  &:hover {
    background-color: ${ ({ isCellInRange }: IContainer ) => !isCellInRange ? 'rgb(245, 245, 245)' : 'rgb(245, 245, 245)' };
  }
`
interface IContainer {
  cellId: SheetCell['id']
  isCellSelected: boolean
  isCellInRange: boolean
  highlightColor: string
}

const SheetRange = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  background-color: ${ ({ isCellInRange, highlightColor }: ISheetRange ) => isCellInRange ? highlightColor : 'transparent'};
`
interface ISheetRange {
  isCellInRange: boolean
  highlightColor: string
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCell
