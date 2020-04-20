//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { ExportToCsv } from 'export-to-csv'
import { useSelector } from 'react-redux'

import { DOWNLOAD } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDownloadCsv = ({
  sheetId
}: SheetActionDownloadCsvProps) => {

  // Redux
  const { 
    allSheets,
    allSheetViews,
    allSheetColumns, 
    allSheetRows, 
    allSheetCells
  } = useSelector((state: IAppState) => state.sheet)
  const activeFilename = useSelector((state: IAppState) => state.folder.allFiles && state.folder.allFiles[state.tab.activeTab] && state.folder.allFiles[state.tab.activeTab].name)
  
  // Local Variables
  const sheet = allSheets && allSheets[sheetId]
  const activeSheetView = sheet && allSheetViews[sheet.activeSheetViewId]

  // Download Csv
  const downloadCsv = () => {

    const visibleColumns = activeSheetView.visibleColumns
    const visibleRows = sheet.visibleRows
    const headers = visibleColumns ? visibleColumns.map(columnId => columnId !== 'COLUMN_BREAK' ? allSheetColumns[columnId].name : '') : []

    const data = visibleRows ? visibleRows.map(rowId => {
      if(rowId !== 'ROW_BREAK') {
        const row = allSheetRows[rowId]
        return visibleColumns.map(columnId => {
          if(columnId !== 'COLUMN_BREAK') {
            if(row.cells && row.cells[columnId] && allSheetCells[row.cells[columnId]]) {
              return allSheetCells[row.cells[columnId]].value ? allSheetCells[row.cells[columnId]].value.replace(',', '').replace('"', '') : ''
            }
            return ''
          }
          return ''
        })
      }
      return null
    }).filter(row => row !== null) : []
    
    const csvExporter = new ExportToCsv({
      filename: activeFilename
    })

    csvExporter.generateCsv([ headers, ...data].filter(Boolean))
  }

  return (
    <SheetActionButton
      onClick={() => downloadCsv()}
      icon={DOWNLOAD}
      tooltip='Download this sheet as a .csv file'>
    </SheetActionButton>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDownloadCsvProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDownloadCsv