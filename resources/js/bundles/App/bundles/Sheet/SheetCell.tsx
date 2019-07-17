//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { updateSheetCell as updateSheetCellAction, CellUpdates } from '@app/state/sheet/actions'
import { Cell, Columns } from '@app/state/sheet/types'

import { selectSheetColumns } from '@app/state/sheet/selectors'
import { selectUserColorSecondary } from '@app/state/user/selectors'

import SheetCellBoolean from '@app/bundles/Sheet/SheetCellBoolean'
import SheetCellDatetime from '@app/bundles/Sheet/SheetCellDatetime'
import SheetCellNumber from '@app/bundles/Sheet/SheetCellNumber'
import SheetCellString from '@app/bundles/Sheet/SheetCellString'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetCellProps) => ({
  boxShadowColor: selectUserColorSecondary(state),
  columns: selectSheetColumns(state, props.sheetId)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateSheetCell: (sheetId: string, cellId: string, updates: CellUpdates) => dispatch(updateSheetCellAction(sheetId, cellId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCell = ({
  boxShadowColor,
  cell: {
    id,
    columnId,
    value
  },
  columns,
  sheetId,
  updateSheetCell
}: SheetCellProps) => {
  
  const cellContainer = useRef(null)
  const [ cellValue, setCellValue ] = useState(value)
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

  const removeHighlightOnClickOutisde = (e: Event) => {
    if(!cellContainer.current.contains(e.target)) {
      setIsHighlighted(false)
    }
  }

  useEffect(() => {
    let updateSheetCellTimer: number = null
    if(cellValue !== value) {
      clearTimeout(updateSheetCellTimer)
      updateSheetCellTimer = setTimeout(() => {
        updateSheetCell(sheetId, id, { value: cellValue })
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
  
  const SheetCellType = columns[columnId] ? sheetCellTypes[columns[columnId].type] : null

  return (
    <Container
      ref={cellContainer}
      boxShadowColor={boxShadowColor}
      isHighlighted={isHighlighted}
      onClick={() => setIsHighlighted(true)}>
      <SheetCellType
        updateCellValue={setCellValue}
        value={cellValue}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellProps {
  boxShadowColor?: string
  cell: Cell
  columns?: Columns
  sheetId: string
  updateSheetCell?(sheetId: string, cellId: string, updates: CellUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.td`
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  border: 0.5px solid rgb(180, 180, 180);
  border-left: none;
  box-shadow: ${ ({ boxShadowColor, isHighlighted }: ContainerProps ) => isHighlighted ? 'inset 0px 0px 0px 2px ' + boxShadowColor : 'none' };
  user-select: none;
`
interface ContainerProps {
  boxShadowColor: string
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetCell)
