//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Columns, Filters, Sorts } from '@app/state/sheet/types'

import SheetActionFilter from '@app/bundles/Sheet/SheetActionFilter'
import SheetActionSort from '@app/bundles/Sheet/SheetActionSort'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  sheetId,
  columns,
  filters,
  sheetActionsHeight,
  sorts
}: SheetActionsProps) => {
  return (
    <Container
      sheetActionsHeight={sheetActionsHeight}>
      <SheetActionFilter
        sheetId={sheetId}
        columns={columns}
        filters={filters}/>
      <SheetActionSort
        sheetId={sheetId}
        columns={columns}
        sorts={sorts}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionsProps {
  columns: Columns
  filters: Filters
  sorts: Sorts
  sheetId: string
  sheetActionsHeight: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  position: sticky;
  top: 0;
  height: ${ ({ sheetActionsHeight }: ContainerProps) => (sheetActionsHeight * 100) + 'vh'};
  padding: 0 0.125rem;
  display: flex;
  align-items: center;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(180, 180, 180);
`
interface ContainerProps {
  sheetActionsHeight: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
