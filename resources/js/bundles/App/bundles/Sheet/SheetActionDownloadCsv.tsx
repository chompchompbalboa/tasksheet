//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { DOWNLOAD } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionButtonDropdown from '@app/bundles/Sheet/SheetActionButtonDropdown'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDownloadCsv = ({
  sheetId
}: SheetActionDownloadCsvProps) => {

  const dispatch = useDispatch()
  const { 
    allSheets,
    allSheetCells, 
    allSheetColumns, 
    allSheetColumnTypes, 
    allSheetRows, 
    allSheetViews
  } = useSelector((state: IAppState) => state.sheet)
  const activeFilename = useSelector((state: IAppState) => state.folder.files && state.folder.files[state.tab.activeTab] && state.folder.files[state.tab.activeTab].name)
  const sheet = allSheets && allSheets[sheetId]

  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  const [ filename, setFilename ] = useState(activeFilename)
  const [ isIncludeColumnTypeInformation, setIsIncludeColumnTypeInformation ] = useState(true)

  useEffect(() => {
    setFilename(activeFilename)
  }, [ activeFilename ])

  const handleFilenameInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }
  const handleFilenameInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  const downloadCsv = () => {
    const activeSheetView = allSheetViews[sheet.activeSheetViewId]
    const visibleColumns = activeSheetView.visibleColumns
    const visibleRows = sheet.visibleRows

    const headers = visibleColumns ? visibleColumns.map(columnId => columnId !== 'COLUMN_BREAK' ? allSheetColumns[columnId].name : null) : []
  
    const data = visibleRows ? visibleRows.map(rowId => {
      if(rowId !== 'ROW_BREAK') {
        const row = allSheetRows[rowId]
        return visibleColumns.map(columnId => {
          if(columnId !== 'COLUMN_BREAK') {
            if(row.cells && row.cells[columnId] && allSheetCells[row.cells[columnId]]) {
              return allSheetCells[row.cells[columnId]].value ? allSheetCells[row.cells[columnId]].value.replace(',', '').replace('"', '') : null
            }
            return null
          }
          return null
        })
      }
      return null
    }).filter(row => row !== null) : []
  
    const columnTypeInformation = data && data.length > 0 ? visibleColumns.map(columnId => {
      const column = allSheetColumns[columnId]
      const columnType = columnId === 'COLUMN_BREAK' ? columnId : allSheetColumnTypes[column.typeId].cellType
      return '[TS][' + columnType + ']'
    }) : []
    
    const csvData = isIncludeColumnTypeInformation ? [ headers, columnTypeInformation, ...data ]  : [ headers, ...data ] 
    console.log(csvData)
  }

  return (
    <SheetActionButton
      closeDropdown={() => setIsDropdownVisible(false)}
      onClick={() => downloadCsv()}
      icon={DOWNLOAD}
      iconSize="0.85rem"
      isDropdownVisible={isDropdownVisible}
      marginLeft="0"
      openDropdown={() => setIsDropdownVisible(true)}
      text='.csv'
      tooltip='Download this sheet as a .csv file'>
      <SheetActionButtonDropdown>
        <DownloadOptions>
          <DownloadOption>
            Filename&nbsp;&nbsp;
            <StyledInput
              value={filename || ''}
              onBlur={() => handleFilenameInputBlur()}
              onChange={e => setFilename(e.target.value)}
              onFocus={() => handleFilenameInputFocus()}/>
          </DownloadOption>
          <DownloadOption>
            <DownloadOptionCheckbox
              type="checkbox"
              checked={isIncludeColumnTypeInformation}
              onChange={() => setIsIncludeColumnTypeInformation(!isIncludeColumnTypeInformation)}/>
            <DownloadOptionText>
              Include Column Type Information
            </DownloadOptionText>
          </DownloadOption>
        </DownloadOptions>
      </SheetActionButtonDropdown>
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
// Styled Components
//-----------------------------------------------------------------------------
const DownloadOptions = styled.div`
`

const DownloadOption = styled.div`
  margin: 0.375rem 0;
  display: flex;
  align-items: center;
`

const DownloadOptionCheckbox = styled.input`
  margin-right: 1rem;
`

const DownloadOptionText = styled.div`
  cursor: default;
  white-space: nowrap;
`

const StyledInput = styled.input`
  border-radius: 3px;
  outline: none;
  font-size: 0.9rem;
  padding: 0.0625rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDownloadCsv