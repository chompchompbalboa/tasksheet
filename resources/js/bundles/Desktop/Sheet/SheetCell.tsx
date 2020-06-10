//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  IAllSheetPriorities,
  ISheet,
  ISheetColumn,
  ISheetRow,
  ISheetCell,
  ISheetCellType,
  ISheetCellPriority,
  ISheetStyles 
} from '@/state/sheet/types'
import {
  updateSheetSelectionFromCellClick
} from '@/state/sheet/actions'

import SheetCellBoolean from '@desktop/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@desktop/Sheet/SheetCellDatetime'
import SheetCellGantt from '@desktop/Sheet/SheetCellGantt'
import SheetCellFiles from '@desktop/Sheet/SheetCellFiles'
import SheetCellLabels from '@desktop/Sheet/SheetCellLabels'
import SheetCellNumber from '@desktop/Sheet/SheetCellNumber'
import SheetCellChanges from '@desktop/Sheet/SheetCellChanges'
import SheetCellPhotos from '@desktop/Sheet/SheetCellPhotos'
import SheetCellString from '@desktop/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCell = memo(({
  sheetId,
  columnId,
  rowId,
  cellType,
  style
}: ISheetCellProps) => {

  // Redux
  const dispatch = useDispatch()
  const allSheetPriorities = useSelector((state: IAppState) => state.sheet.allSheetPriorities)
  const sheetCellPriorities = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].cellPriorities)
  const cellId = useSelector((state: IAppState) => state.sheet.allSheetRows && state.sheet.allSheetRows[rowId] && state.sheet.allSheetRows[rowId].cells[columnId])
  const cell = useSelector((state: IAppState) => cellId && state.sheet.allSheetCells[cellId])
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].styles)
  const userColorSecondary = useSelector((state: IAppState) => state.user.color.secondary)
  const isTrackCellChanges = useSelector((state: IAppState) => cell && state.sheet.allSheetColumns && state.sheet.allSheetColumns[cell.columnId] && state.sheet.allSheetColumns[cell.columnId].trackCellChanges)
  const isShowCellChanges = useSelector((state: IAppState) => cell && state.sheet.allSheetColumns && state.sheet.allSheetColumns[cell.columnId] && state.sheet.allSheetColumns[cell.columnId].showCellChanges)
  
  // Make sure the cell exists
  if(cell) {

    // Refs
    const cellContainer = useRef(null)

    // Cell selection state
    const isCellEditing = cell.isCellEditing
    const isCellSelected = cell.isCellSelectedSheetIds.has(sheetId)
    const isCellInRange = sheetSelectionsRangeCellIds.has(cellId)

    // Update selection when cell is clicked
    const handleMouseDown = (e: MouseEvent) => {
      dispatch(updateSheetSelectionFromCellClick(sheetId, cell.id, e.shiftKey))
    }

    // Cell types
    const sheetCellTypes = {
      STRING: SheetCellString,
      NUMBER: SheetCellNumber,
      BOOLEAN: SheetCellBoolean,
      DATETIME: SheetCellDatetime,
      PHOTOS: SheetCellPhotos,
      FILES: SheetCellFiles,
      LABELS: SheetCellLabels,
      GANTT: SheetCellGantt
    }
    const SheetCellType = sheetCellTypes[cellType]

    return (
      <Container
        data-testid="SheetCell"
        ref={cellContainer}
        cellId={cellId}
        cellType={cellType}
        highlightColor={userColorSecondary}
        isCellSelected={isCellSelected}
        isCellInRange={isCellInRange}
        onMouseDown={handleMouseDown}
        allSheetPriorities={allSheetPriorities}
        sheetCellPriorities={sheetCellPriorities}
        sheetStyles={sheetStyles}
        isShowCellChanges={isShowCellChanges}
        isTrackCellChanges={isTrackCellChanges}
        style={style}>
        <SheetRange
          data-testid="SheetCellSheetRange"
          isCellInRange={isCellInRange}
          highlightColor={userColorSecondary}/>
        <SheetCellType
          sheetId={sheetId}
          columnId={columnId}
          rowId={rowId}
          cell={cell}
          isCellEditing={isCellEditing}
          isCellInRange={isCellInRange}
          isCellSelected={isCellSelected}
          isShowCellChanges={isShowCellChanges}
          isTrackCellChanges={isTrackCellChanges}/>
        {isCellSelected 
          && !isCellInRange 
          && isTrackCellChanges 
          && isShowCellChanges 
          && (cellType === 'DATETIME' ? !isCellEditing : true)
          &&
          <SheetCellChanges
            cellId={cell.id}/>
        }
      </Container>
    )
  }
  // If the cell doesn't exist, render a dummy cell
  return (
    <SheetCellNotFoundContainer
      data-testid="SheetCellNotFoundContainer"
      cellId={cellId}
      cellType={cellType}
      highlightColor={userColorSecondary}
      isCellSelected={false}
      isCellInRange={false}
      allSheetPriorities={allSheetPriorities}
      sheetCellPriorities={sheetCellPriorities}
      sheetStyles={sheetStyles}
      isShowCellChanges={isShowCellChanges}
      isTrackCellChanges={isTrackCellChanges}
      style={style}/>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  rowId: ISheetRow['id']
  cellType: ISheetCellType
  style: {
    width?: ReactText
    height?: ReactText
  }
}

export interface ISheetCellTypesSharedProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  rowId: ISheetRow['id']
  cell: ISheetCell
  isCellEditing: boolean
  isCellInRange: boolean
  isCellSelected: boolean
  isShowCellChanges: boolean
  isTrackCellChanges: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ cellType, isCellSelected, isShowCellChanges, isTrackCellChanges }: IContainer ) => 
    (['DATETIME', 'FILES', 'GANTT', 'PHOTOS'].includes(cellType) || (isTrackCellChanges && isShowCellChanges))
    && isCellSelected 
      ? '20' 
      : '10' 
  };
  position: relative;
  cursor: default;
  font-size: 0.9rem;
  border-right: 0.5px solid rgb(180, 180, 180);
  border-bottom: 0.5px solid rgb(180, 180, 180);
  user-select: none;
  background-color: ${ ({ allSheetPriorities, cellId, isCellSelected, sheetCellPriorities, sheetStyles }: IContainer ) => 
    sheetCellPriorities[cellId]
    ? allSheetPriorities[sheetCellPriorities[cellId].priorityId].backgroundColor
    : sheetStyles.backgroundColor.has(cellId)
        ? sheetStyles.backgroundColorReference[cellId]
        : isCellSelected
          ? 'rgb(245, 245, 245)'
          : 'white'
  };
  color: ${ ({ cellId, sheetStyles }: IContainer ) => sheetStyles.color.has(cellId) ? sheetStyles.colorReference[cellId] : 'black' };
  box-shadow: ${ ({ isCellSelected, highlightColor }: IContainer ) => isCellSelected ? 'inset 0px 0px 0px 2px ' + highlightColor : 'none' };
  overflow: ${ ({ isCellSelected, isCellInRange }: IContainer ) => isCellSelected || isCellInRange ? 'visible' : 'hidden' };
  &:hover {
    background-color: ${ ({ allSheetPriorities, cellId, sheetCellPriorities, sheetStyles }: IContainer ) => 
      sheetCellPriorities[cellId]
      ? allSheetPriorities[sheetCellPriorities[cellId].priorityId].backgroundColor
      : sheetStyles.backgroundColor.has(cellId)
          ? sheetStyles.backgroundColorReference[cellId]
          : 'rgb(245, 245, 245)'
    };
  }
`
interface IContainer {
  cellId: ISheetCell['id']
  allSheetPriorities: IAllSheetPriorities
  cellType: ISheetCellType
  isCellSelected: boolean
  isCellInRange: boolean
  highlightColor: string
  sheetCellPriorities: { [cellId: string]: ISheetCellPriority }
  sheetStyles: ISheetStyles
  isShowCellChanges: boolean
  isTrackCellChanges: boolean
}

const SheetCellNotFoundContainer = styled(Container)`
  background-color: rgb(190, 190, 190);
`

const SheetRange = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.13;
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
