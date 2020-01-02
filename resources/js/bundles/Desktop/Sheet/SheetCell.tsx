//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetCell, 
  ISheetCellType,
  ISheetStyles 
} from '@/state/sheet/types'
import {
  updateSheetSelectionFromCellClick
} from '@/state/sheet/actions'

import SheetCellBoolean from '@desktop/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@desktop/Sheet/SheetCellDatetime'
import SheetCellFiles from '@desktop/Sheet/SheetCellFiles'
import SheetCellNumber from '@desktop/Sheet/SheetCellNumber'
import SheetCellChanges from '@desktop/Sheet/SheetCellChanges'
import SheetCellPhotos from '@desktop/Sheet/SheetCellPhotos'
import SheetCellString from '@desktop/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCell = memo(({
  sheetId,
  cellId,
  cellType,
  style
}: ISheetCellProps) => {

  // Redux
  const dispatch = useDispatch()
  const cell = useSelector((state: IAppState) => state.sheet.allSheetCells[cellId])
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].styles)
  const userColorSecondary = useSelector((state: IAppState) => state.user.color.secondary)
  const trackCellChanges = useSelector((state: IAppState) => cell && state.sheet.allSheetColumns && state.sheet.allSheetColumns[cell.columnId] && state.sheet.allSheetColumns[cell.columnId].trackCellChanges)
  const showCellChanges = useSelector((state: IAppState) => cell && state.sheet.allSheetColumns && state.sheet.allSheetColumns[cell.columnId] && state.sheet.allSheetColumns[cell.columnId].showCellChanges)
  
  // Make sure the cell exists
  if(cell) {

    // Refs
    const cellContainer = useRef(null)

    // Cell selection state
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
      FILES: SheetCellFiles
    }
    const SheetCellType = sheetCellTypes[cellType]

    return (
      <Container
        data-testid="SheetCellContainer"
        ref={cellContainer}
        cellId={cellId}
        cellType={cellType}
        highlightColor={userColorSecondary}
        isCellSelected={isCellSelected}
        isCellInRange={isCellInRange}
        onMouseDown={handleMouseDown}
        sheetStyles={sheetStyles}
        showCellChanges={showCellChanges}
        trackCellChanges={trackCellChanges}
        style={style}>
        <SheetRange
          data-testid="SheetCellSheetRange"
          isCellInRange={isCellInRange}
          highlightColor={userColorSecondary}/>
        <SheetCellType
          sheetId={sheetId}
          cell={cell}
          isCellInRange={isCellInRange}/>
        <SheetCellChanges
          cellId={cell.id}
          showCellChanges={showCellChanges}
          trackCellChanges={trackCellChanges}/>
      </Container>
    )
  }
  // If the cell doesn't exist, render a dummy cell
  return (
    <Container
      data-testid="SheetCellNotFoundContainer"
      cellId={cellId}
      cellType={cellType}
      highlightColor={userColorSecondary}
      isCellSelected={false}
      isCellInRange={false}
      sheetStyles={sheetStyles}
      showCellChanges={showCellChanges}
      trackCellChanges={trackCellChanges}
      style={style}/>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellProps {
  sheetId: ISheet['id']
  cellId: ISheetCell['id']
  cellType: ISheetCellType
  style: {
    width?: ReactText
  }
}

export interface ISheetCellTypesSharedProps {
  sheetId: ISheet['id']
  cell: ISheetCell
  isCellInRange?: boolean // Always provided, only used by some cell types
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ cellType, isCellSelected, showCellChanges, trackCellChanges }: IContainer ) => 
    (['DATETIME', 'FILES', 'PHOTOS', 'TEAM_MEMBERS'].includes(cellType) || (trackCellChanges && showCellChanges))
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
  showCellChanges: boolean
  trackCellChanges: boolean
}

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