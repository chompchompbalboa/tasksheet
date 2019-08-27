//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ReactText, memo, MouseEvent, useEffect, useRef, useState } from 'react'
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
    if(cell && cell.isCellSelected) {
      return 'inset 0px 0px 0px 2px ' + highlightColor
    }
    return 'none'
  }
  return (
    <>
      <Container
        ref={cellContainer}
        containerBoxShadow={getContainerBoxShadow()}
        isCellSelected={cell.isCellSelected}
        isRangeSelected={cell.isRangeStart || cell.isRangeEnd}
        onClick={handleClick}
        style={style}>
        <RangeSelection
          cellHeight={24}
          cellWidth={style.width as number}
          highlightColor={highlightColor}
          isRangeStart={cell.isRangeStart}
          isRangeEnd={cell.isRangeEnd}
          rangeWidth={cell.rangeWidth}
          rangeHeight={cell.rangeHeight}/>
        <SheetCellType
          cellId={cell.id}
          updateCellValue={setCellValue}
          value={cellValue}/>
      </Container>
    </>
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
  style: {
    width?: ReactText
  }
  type: SheetColumnType
  updateSheetCell(cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetSelection(cellId: string, isShiftPressed: boolean): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isRangeSelected }: ContainerProps ) => isRangeSelected ? '10' : '5' };
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  border-right: 0.5px solid rgb(180, 180, 180);
  border-bottom: 0.5px solid rgb(180, 180, 180);
  box-shadow: ${ ({ containerBoxShadow }: ContainerProps ) => containerBoxShadow };
  user-select: none;
  background-color: ${ ({ isCellSelected }: ContainerProps ) => isCellSelected ? 'rgb(245, 245, 245)' : 'white' };
  overflow: ${ ({ isRangeSelected }: ContainerProps ) => isRangeSelected ? 'visible' : 'hidden' };
  &:hover {
    background-color: ${ ({ isRangeSelected }: ContainerProps ) => isRangeSelected ? 'white' : 'rgb(245, 245, 245)' };
  }
`
interface ContainerProps {
  containerBoxShadow: string
  isCellSelected: boolean
  isRangeSelected: boolean
}

const RangeSelection = styled.div`
  display: ${ ({ isRangeStart, isRangeEnd }: RangeSelectionProps ) => isRangeStart || isRangeEnd ? 'block' : 'none' };
  position: absolute;
  top: ${ ({ cellHeight, isRangeStart, rangeHeight }: RangeSelectionProps ) => isRangeStart ? 0 : -(rangeHeight - cellHeight) + 'px' };
  left: ${ ({ cellWidth, isRangeStart, rangeWidth }: RangeSelectionProps ) => isRangeStart ? 0 : -(rangeWidth - cellWidth) + 'px' };
  width: ${ ({ rangeWidth }: RangeSelectionProps ) => rangeWidth + 'px' };
  height: ${ ({ rangeHeight }: RangeSelectionProps ) => rangeHeight + 'px' };
  background-color: ${ ({ highlightColor }: RangeSelectionProps ) => highlightColor };
  opacity: ${ ({ isRangeEnd }: RangeSelectionProps ) => isRangeEnd ? '0.15' : '0.075' };
`
interface RangeSelectionProps {
  cellWidth: number
  cellHeight: number
  highlightColor: string
  isRangeStart: boolean
  isRangeEnd: boolean
  rangeWidth: number
  rangeHeight: number
}
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetCell)
