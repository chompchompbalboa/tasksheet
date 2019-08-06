//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { SheetColumn, SheetColumns, SheetFilter, SheetFilters, SheetGroup, SheetGroups, SheetSort, SheetSorts } from '@app/state/sheet/types'

import SheetActionFilter from '@app/bundles/Sheet/SheetActionFilter'
import SheetActionGroup from '@app/bundles/Sheet/SheetActionGroup'
import SheetActionSaveView from '@app/bundles/Sheet/SheetActionSaveView'
import SheetActionSort from '@app/bundles/Sheet/SheetActionSort'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  sheetId,
  columns,
  groups,
  filters,
  sheetFilters,
  sheetGroups,
  sheetSorts,
  sheetVisibleColumns,
  sorts
}: SheetActionsProps) => {
  return (
    <Container>
      <SheetActionFilter
        sheetId={sheetId}
        columns={columns}
        filters={filters}
        sheetFilters={sheetFilters}
        sheetVisibleColumns={sheetVisibleColumns}/>
      <SheetActionGroup
        sheetId={sheetId}
        columns={columns}
        groups={groups}
        sheetGroups={sheetGroups}
        sheetVisibleColumns={sheetVisibleColumns}/>
      <SheetActionSort
        sheetId={sheetId}
        columns={columns}
        sorts={sorts}
        sheetSorts={sheetSorts}
        sheetVisibleColumns={sheetVisibleColumns}/>
      <SheetActionSaveView
        sheetId={sheetId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionsProps {
  columns: SheetColumns
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
  sheetId: string
  sheetFilters?: SheetFilter['id'][]
  sheetGroups?: SheetGroup['id'][]
  sheetSorts?: SheetSort['id'][]
  sheetVisibleColumns: SheetColumn['id'][]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  position: sticky;
  top: 0;
  padding: 0.25rem 0.125rem;
  display: flex;
  align-items: center;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(180, 180, 180);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
