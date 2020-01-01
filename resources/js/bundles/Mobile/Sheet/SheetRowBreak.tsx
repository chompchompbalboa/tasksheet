//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'


//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetListRowBreak = memo(({
  style
}: ISheetListRowBreakProps) => {

  return (
    <Container
      style={style}>
      <BreakLine/>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetListRowBreakProps {
  style: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  padding: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BreakLine = styled.div`
  width: 85%;
  height: 10px;
  background-color: rgb(190, 190, 190);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetListRowBreak
