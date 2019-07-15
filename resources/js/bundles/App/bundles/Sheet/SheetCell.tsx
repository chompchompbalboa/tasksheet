//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
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

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCell = ({
  boxShadowColor,
  cell: {
    columnId,
    value
  },
  columns
}: SheetCellProps) => {
  
  const cellContainer = useRef(null)
  const [ cellValue, setCellValue ] = useState(value)
  const [ isHighlighted, setIsHighlighted ] = useState(false)
  
  useEffect(() => {
    if(isHighlighted) {
      window.addEventListener('click', handleClick)
    }
    else {
      window.removeEventListener('click', handleClick)
    }
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [ isHighlighted ])

  const handleClick = (e: Event) => {
    if(!cellContainer.current.contains(e.target)) {
      setIsHighlighted(false)
    }
  }
  
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
        setCellValue={setCellValue}
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
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.td`
  cursor: default;
  padding: 0.15rem 0 0.15rem 0.25rem;
  border: 0.5px dashed black;
  border-left: none;
  box-shadow: ${ ({ boxShadowColor, isHighlighted }: ContainerProps ) => isHighlighted ? 'inset 0px 0px 0px 2px ' + boxShadowColor : 'none' };
`
interface ContainerProps {
  boxShadowColor: string
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetCell)
