//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useLayoutEffect, useRef } from 'react'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDownloadCsvDownloader = ({
  sheetId
}: SheetActionDownloadCsvDownloaderProps) => {
  
  const downloader = useRef(null)
  
  useLayoutEffect(() => {
    if(downloader) { console.log(downloader.current.link) }
    downloader && downloader.current && downloader.current.link && downloader.current.link.click()
  }, [])
  
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

  return (
    <StyledCSVLink
      ref={downloader}
      data={csvData}
      filename={'tracksheet.csv'}>
    </StyledCSVLink>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDownloadCsvDownloaderProps {
  sheetId: Sheet['id']
}

const StyledCSVLink = styled(CSVLink)`
  display: none;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDownloadCsvDownloader
