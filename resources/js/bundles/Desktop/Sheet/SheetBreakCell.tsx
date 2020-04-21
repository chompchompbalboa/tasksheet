//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetBreakCell = memo(({
  isLast = false,
  isRowBreak = false,
  style
}: SheetBreakCellProps) => {
  return (
    <Container 
      isLast={isLast}
      isRowBreak={isRowBreak}
      style={style}/>
)}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetBreakCellProps {
  isLast?: boolean
  isRowBreak?: boolean
  style: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  position: relative;
  cursor: default;
  padding: 0.15rem 0.25rem;
  font-size: 0.9rem;
  user-select: none;
  background-color: rgb(210, 210, 210);
  border-right: 0.5px solid ${ ({ isLast, isRowBreak }: IContainer ) => isRowBreak ? (isLast ? 'rgb(180, 180, 180)' : 'rgb(210, 210, 210)') : 'rgb(180, 180, 180)' };
  border-bottom: 0.5px solid rgb(180, 180, 180);
`
interface IContainer {
  isLast: boolean
  isRowBreak: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetBreakCell
