//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { 
  ISheetCell, ISheetCellUpdates, 
  ISheetColumnType, 
  ISheetStyles 
} from '@app/state/sheet/types'

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
  const cell = useSelector((state: AppState) => state.sheet.allSheetCells[cellId])
  const sheetSelectionsRangeCellIds = useSelector((state: AppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)
  const sheetStyles = useSelector((state: AppState) => state.sheet.allSheets[sheetId].styles)
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
    return () => clearTimeout(updateSheetCellTimer)
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
        sheetStyles={sheetStyles}
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
  cellId: ISheetCell['id']
  columnType: ISheetColumnType
  highlightColor: string
  style: {
    width?: ReactText
  }
  updateSheetCell(cellId: string, updates: ISheetCellUpdates, undoUpdates?: ISheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetSelectionFromArrowKey(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  updateSheetSelectionFromCellClick(cellId: string, isShiftPressed: boolean): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isCellSelected, isCellInRange }: IContainer ) => isCellSelected || isCellInRange ? '10' : '5' };
  position: relative;
  cursor: default;
  font-size: 0.9rem;
  border-right: 0.5px solid rgb(180, 180, 180);
  border-bottom: 0.5px solid rgb(180, 180, 180);
  user-select: none;
  background-color: ${ ({ cellId, isCellSelected, sheetStyles }: IContainer ) => 
    sheetStyles.backgroundColor.has(cellId)
      ? sheetStyles.backgroundColorReference[cellId]
      : isCellSelected
        ? 'rgb(245, 245, 245)'
        : 'white'
  };
  color: ${ ({ cellId, isCellSelected, sheetStyles }: IContainer ) => sheetStyles.color.has(cellId) ? sheetStyles.colorReference[cellId] : 'black' };
  box-shadow: ${ ({ isCellSelected, highlightColor }: IContainer ) => isCellSelected ? 'inset 0px 0px 0px 2px ' + highlightColor : 'none' };
  overflow: ${ ({ isCellSelected, isCellInRange }: IContainer ) => isCellSelected || isCellInRange ? 'visible' : 'hidden' };
  &:hover {
    background-color: ${ ({ cellId, isCellSelected, sheetStyles }: IContainer ) => 
      sheetStyles.backgroundColor.has(cellId)
        ? sheetStyles.backgroundColorReference[cellId]
        : 'rgb(245, 245, 245)'
    };
  }
`
interface IContainer {
  cellId: ISheetCell['id']
  isCellSelected: boolean
  isCellInRange: boolean
  highlightColor: string
  sheetStyles: ISheetStyles
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
