//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { CSVDownload } from 'react-csv'
import { useSelector } from 'react-redux'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDownloadCsvDownloader = ({
  sheetId
}: SheetActionDownloadCsvDownloaderProps) => {
  
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
    <CSVDownload
      data={csvData}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDownloadCsvDownloaderProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDownloadCsvDownloader
