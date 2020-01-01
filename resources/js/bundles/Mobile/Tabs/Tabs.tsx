//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'
import OpenFiles from '@mobile/Tabs/TabsFiles'
import SheetViews from '@mobile/Tabs/TabsSheetViews'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Tabs = () => {
  return (
    <Container>
      <SelectionContainers>
        <OpenFiles />
        <SheetViews />
      </SelectionContainers>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

const SelectionContainers = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  background-color: white;
  color: black;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Tabs
