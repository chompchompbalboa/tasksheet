//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { 
  ISheetCell, 
  ISheetCellType,
  ISheetColumnType,
  ISheetStyles 
} from '@app/state/sheet/types'
import {
  updateSheetCell,
  updateSheetSelectionFromCellClick
} from '@app/state/sheet/actions'

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
export const SheetCell = memo(({
  sheetId,
  cellId,
  columnType,
  style
}: ISheetCellProps) => {

  const dispatch = useDispatch()

  // Redux
  const cell = useSelector((state: IAppState) => state.sheet.allSheetCells[cellId])
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].styles)
  const userColorSecondary = useSelector((state: IAppState) => state.user.color.secondary)
  
  if(cell) {

    // Refs
    const cellContainer = useRef(null)

    // Local State
    const [ cellValue, setCellValue ] = useState(cell ? cell.value : null)

    // Effects
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
          dispatch(updateSheetCell(cell.id, { value: cellValue }, { value: cell.value }))
        }, 1000)
      }
      return () => clearTimeout(updateSheetCellTimer)
    }, [ cellValue ])

    // Cell types
    const sheetCellTypes = {
      STRING: SheetCellString,
      NUMBER: SheetCellNumber,
      BOOLEAN: SheetCellBoolean,
      DATETIME: SheetCellDatetime,
      DROPDOWN: SheetCellDropdown,
      PHOTOS: SheetCellPhotos,
      FILES: SheetCellFiles
    }

    // Update selection when cell is clicked
    const handleMouseDown = (e: MouseEvent) => {
      if(columnType.cellType !== 'BOOLEAN' || e.shiftKey) {
        dispatch(updateSheetSelectionFromCellClick(sheetId, cell.id, e.shiftKey))
      }
    }

    const isCellSelected = cell.isCellSelectedSheetIds.has(sheetId)
    const isCellInRange = sheetSelectionsRangeCellIds.has(cellId)
    const SheetCellType = sheetCellTypes[columnType.cellType]

    return (
      <Container
        data-testid="SheetCellContainer"
        ref={cellContainer}
        cellId={cellId}
        cellType={columnType.cellType}
        highlightColor={userColorSecondary}
        isCellSelected={isCellSelected}
        isCellInRange={isCellInRange}
        onMouseDown={handleMouseDown}
        sheetStyles={sheetStyles}
        style={style}>
        <SheetRange
          data-testid="SheetCellSheetRange"
          isCellInRange={isCellInRange}
          highlightColor={userColorSecondary}/>
        <SheetCellType
          sheetId={sheetId}
          cell={cell}
          cellId={cell.id}
          columnType={columnType}
          isCellSelected={isCellSelected}
          updateCellValue={setCellValue}
          value={cellValue}/>
      </Container>
    )
  }
  return (
    <Container
      data-testid="SheetCellNotFoundContainer"
      cellId={cellId}
      cellType='STRING'
      highlightColor={userColorSecondary}
      isCellSelected={false}
      isCellInRange={false}
      sheetStyles={sheetStyles}
      style={style}/>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellProps {
  sheetId: string
  cellId: ISheetCell['id']
  columnType: ISheetColumnType
  style: {
    width?: ReactText
  }
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ cellType, isCellSelected }: IContainer ) => ['DATETIME', 'FILES', 'PHOTOS'].includes(cellType) && isCellSelected ? '20' : '10' };
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
  color: ${ ({ cellId, sheetStyles }: IContainer ) => sheetStyles.color.has(cellId) ? sheetStyles.colorReference[cellId] : 'black' };
  box-shadow: ${ ({ isCellSelected, highlightColor }: IContainer ) => isCellSelected ? 'inset 0px 0px 0px 2px ' + highlightColor : 'none' };
  overflow: ${ ({ isCellSelected, isCellInRange }: IContainer ) => isCellSelected || isCellInRange ? 'visible' : 'hidden' };
  &:hover {
    background-color: ${ ({ cellId, sheetStyles }: IContainer ) => 
      sheetStyles.backgroundColor.has(cellId)
        ? sheetStyles.backgroundColorReference[cellId]
        : 'rgb(245, 245, 245)'
    };
  }
`
interface IContainer {
  cellId: ISheetCell['id']
  cellType: ISheetCellType
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
  pointer-events: none;
`
interface ISheetRange {
  isCellInRange: boolean
  highlightColor: string
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCell
