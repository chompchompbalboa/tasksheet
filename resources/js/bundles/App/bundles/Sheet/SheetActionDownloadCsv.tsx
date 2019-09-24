//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, DOWNLOAD } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionDownloadCsv = ({
  sheetId
}: SheetActionDownloadCsvProps) => {

  // Refs
  const dropdown = useRef(null)

  // Redux
  const dispatch = useDispatch()

  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  
  const { cells, columns, columnTypes, rows, sheets } = useSelector((state: AppState) => state.sheet)
  const activeFilename = useSelector((state: AppState) => state.folder.files && state.folder.files[state.tab.activeTab] && state.folder.files[state.tab.activeTab].name)
  const sheet = sheets && sheets[sheetId]
  const visibleColumns = sheet && sheet.visibleColumns
  const visibleRows = sheet && sheet.visibleRows

  // Dropdown
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  useEffect(() => {
    if(isDropdownVisible) { addEventListener('mousedown', closeOnClickOutside) }
    else { removeEventListener('mousedown', closeOnClickOutside) }
    return () => removeEventListener('mousedown', closeOnClickOutside)
  })
  const closeOnClickOutside = (e: MouseEvent) => {
    if(!dropdown.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }
  
  // Filename
  const [ filename, setFilename ] = useState(activeFilename)
  const handleFilenameBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }
  const handleFilenameFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  // CSV data
  const [ isIncludeColumnTypeInformation, setIsIncludeColumnTypeInformation ] = useState(true)
  const headers = visibleColumns ? visibleColumns.map(columnId => columnId !== 'COLUMN_BREAK' ? columns[columnId].name : null) : []

  const data = visibleRows ? visibleRows.map(rowId => {
    if(rowId !== 'ROW_BREAK') {
      const row = rows[rowId]
      return visibleColumns.map(columnId => columnId !== 'COLUMN_BREAK' ? cells[row.cells[columnId]].value : null)
    }
    return null
  }).filter(row => row !== null) : []

  const columnTypeInformation = data && data.length > 0 ? visibleColumns.map(columnId => {
    const column = columns[columnId]
    const columnType = columnTypes[column.typeId]
    return '[TS][' + columnType.cellType + ']'
  }) : []
  
  const csvData = isIncludeColumnTypeInformation ? [ headers, columnTypeInformation, ...data ]  : [ headers, ...data ] 

  // Render
  return (
    <Container>
      <DownloadContainer
        data={csvData}
        filename={filename + '.csv'}
        containerBackgroundColor={userColorPrimary}>
        <Icon icon={DOWNLOAD}/>&nbsp;CSV
      </DownloadContainer>
      <DropdownToggle
        dropdownToggleBackgroundColor={userColorPrimary}
        onClick={() => setIsDropdownVisible(true)}>
        <Icon 
          icon={ARROW_DOWN}/>
      </DropdownToggle>
      <Dropdown
        ref={dropdown}
        isDropdownVisible={isDropdownVisible}>
        <DownloadOptions>
          <DownloadOption>
            Filename&nbsp;&nbsp;
            <StyledInput
              value={filename}
              onBlur={() => handleFilenameBlur()}
              onChange={e => setFilename(e.target.value)}
              onFocus={() => handleFilenameFocus()}/>
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
      </Dropdown>
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
const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  border-radius: 3px;
  transition: all 0.05s;
`

const DownloadContainer = styled(({ containerBackgroundColor, ...rest }) => <CSVLink {...rest}/>)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.325rem 0.4rem;
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IDownloadContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IDownloadContainer {
  containerBackgroundColor: string
}

const DropdownToggle = styled.div`
  cursor: pointer;
  padding: 0.4rem 0.1rem;
  color: rgb(80, 80, 80);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 1px solid rgb(170, 170, 170);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ dropdownToggleBackgroundColor }: IDropdownToggle) => dropdownToggleBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IDropdownToggle {
  dropdownToggleBackgroundColor: string
}

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: IDropdown) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  left: 0;
  top: 100%;
  padding: 0.125rem 0.625rem;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`
interface IDropdown {
  isDropdownVisible: boolean
}

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
