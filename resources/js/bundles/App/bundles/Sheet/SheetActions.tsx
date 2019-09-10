//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { Sheet, SheetColumn, SheetColumns, SheetFilter, SheetFilters, SheetGroup, SheetGroups, SheetSort, SheetSorts } from '@app/state/sheet/types'

import SheetActionCreateRows from '@app/bundles/Sheet/SheetActionCreateRows'
import SheetActionDownloadCsv from '@app/bundles/Sheet/SheetActionDownloadCsv'
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
  createSheetRow,
  groups,
  filters,
  sheetFilters,
  sheetGroups,
  sheetSorts,
  sheetVisibleColumns,
  sorts,
  sourceSheetId,
}: SheetActionsProps) => {
  return (
    <Container>
      <SheetActionCreateRows
        createSheetRow={createSheetRow}
        sheetId={sheetId}
        sourceSheetId={sourceSheetId}/>
      <Divider />
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
      <Divider />
      <SheetActionDownloadCsv
        sheetId={sheetId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionsProps {
  columns: SheetColumns
  createSheetRow(sheetId: Sheet['id'], sourceSheetId: Sheet['id']): void
  filters: SheetFilters
  groups: SheetGroups
  sorts: SheetSorts
  sheetId: Sheet['id']
  sourceSheetId: Sheet['id']
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
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(180, 180, 180);
`

const Divider = styled.div`
  margin: 0 0.75rem;
  height: 1.5rem;
  width: 1px;
  background-color: rgb(180, 180, 180)
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
