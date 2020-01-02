//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnBreak = ({
  isFirstColumn,
  isLastColumn
}: ISheetColumnBreak) => (
  <Container
    isFirstColumn={isFirstColumn}
    isLastColumn={isLastColumn}/>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetColumnBreak {
  isFirstColumn: boolean
  isLastColumn: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 3px;
  width: 100%;
  background-color: rgb(190, 190, 190);
  border-top-left-radius: ${ ({ isFirstColumn }: IContainer) => isFirstColumn ? '3px' : 'none' };
  border-top-right-radius: ${ ({ isFirstColumn }: IContainer) => isFirstColumn ? '3px' : 'none' };
  border-bottom-left-radius: ${ ({ isLastColumn }: IContainer) => isLastColumn ? '3px' : 'none' };
  border-bottom-right-radius: ${ ({ isLastColumn }: IContainer) => isLastColumn ? '3px' : 'none' };
`
interface IContainer {
  isFirstColumn: boolean
  isLastColumn: boolean
}


//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnBreak
