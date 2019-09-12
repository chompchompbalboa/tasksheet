//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { DOWNLOAD } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDownloadCsv = ({
  sheetId
}: SheetActionDownloadCsvProps) => {
  
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  /*
  const { cells, columns, rows, sheets } = useSelector((state: AppState) => state.sheet)
  const sheet = sheets && sheets[sheetId]
  const visibleColumns = sheet && sheet.visibleColumns
  const visibleRows = sheet && sheet.visibleRows
  
  const headers = visibleColumns ? visibleColumns.map(columnId => columnId !== 'COLUMN_BREAK' ? columns[columnId].name : null) : []
  const data = visibleRows ? visibleRows.map(rowId => {
    if(rowId !== 'ROW_BREAK') {
      const row = rows[rowId]
      return visibleColumns.map(columnId => columnId !== 'COLUMN_BREAK' ? cells[row.cells[columnId]].value : null)
    }
    return null
  }).filter(row => row !== null) : []
  
  const csvData = [ headers, ...data ]
  */
  const csvData: string[] = []

  return (
    <Container
      data={csvData}
      filename='tracksheet.csv'
      containerBackgroundColor={userColorPrimary}>
      <Icon icon={DOWNLOAD}/>&nbsp;CSV
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDownloadCsvProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled(({ containerBackgroundColor, ...rest }) => <CSVLink {...rest}/>)`
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDownloadCsv
