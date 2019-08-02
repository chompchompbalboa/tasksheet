//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { SheetColumn } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCreateRow = ({
  column
}: SheetCreateRowProps) => {
  return (
    <Container
      containerWidth={column.width}>
      <StyledInput
        onChange={e => null}
        placeholder={column.name}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCreateRowProps {
  column: SheetColumn
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: inline-block;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
`
interface ContainerProps {
  containerWidth: number
}

const StyledInput = styled.input`
  width: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCreateRow
