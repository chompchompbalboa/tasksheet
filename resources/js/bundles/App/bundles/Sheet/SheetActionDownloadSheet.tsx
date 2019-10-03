//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { download } from '@app/api'

import { ARROW_DOWN, DOWNLOAD } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
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
const SheetActionDownloadSheet = ({
  sheetId
}: SheetActionDownloadSheetProps) => {

  // Refs
  const dropdown = useRef(null)

  // Redux
  const dispatch = useDispatch()

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  
  const allSheets = useSelector((state: IAppState) => state.sheet.allSheets)
  const activeFilename = useSelector((state: IAppState) => state.folder.files && state.folder.files[state.tab.activeTab] && state.folder.files[state.tab.activeTab].name)
  const sheet = allSheets && allSheets[sheetId]
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

  // Options
  const [ downloadId, setDownloadId ] = useState(null)
  const [ filename, setFilename ] = useState(activeFilename)
  const [ isIncludeColumnTypeInformation, setIsIncludeColumnTypeInformation ] = useState(true)
  const [ isIncludeAssets, setIsIncludeAssets ] = useState(true)
  const [ isDownloadPreparing, setIsDownloadPreparing ] = useState(false)
  const [ isDownloadPrepared, setIsDownloadPrepared ] = useState(false)

  const handlePrepareDownloadClick = () => {
    setIsDownloadPreparing(true)
    download.prepareSheetDownload(sheetId, {
      filename: filename,
      includeAssets: isIncludeAssets,
      includeColumnTypeInformation: isIncludeColumnTypeInformation,
      visibleRows: visibleRows
    }).then(sheetDownloadId => {
      setIsDownloadPreparing(false)
      setIsDownloadPrepared(true)
      setDownloadId(sheetDownloadId)
    })
  }
  
  const handleDownloadClick = () => {
    if(isDownloadPrepared) {
      setIsDownloadPreparing(false)
      setIsDownloadPrepared(false)
      setDownloadId(null)
      const url = '/app/sheets/download/' + downloadId
      window.open(url, '_blank')
    }
  }
  // Render
  return (
    <Container>
      <DownloadContainer
        isDownloadPrepared={isDownloadPrepared}
        containerBackgroundColor={userColorPrimary}
        onClick={isDownloadPrepared ? () => handleDownloadClick() : () => null}>
        <Icon icon={DOWNLOAD}/>&nbsp;{isDownloadPrepared ? 'Download' : (isDownloadPreparing ? 'Preparing...' : 'Sheet')}
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
          <DownloadOption>
            <DownloadOptionCheckbox
              type="checkbox"
              checked={isIncludeAssets}
              onChange={() => setIsIncludeAssets(!isIncludeAssets)}/>
            <DownloadOptionText>
              Include Photos and Files
            </DownloadOptionText>
          </DownloadOption>
          <DownloadOption>
            <DownloadButton
              containerBackgroundColor={userColorPrimary}
              onClick={isDownloadPrepared ? () => handleDownloadClick() : () => handlePrepareDownloadClick()}>
              {isDownloadPrepared ? 'Download' : (isDownloadPreparing ? 'Preparing...' : 'Prepare Download')}
            </DownloadButton>
          </DownloadOption>
        </DownloadOptions>
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionDownloadSheetProps {
  sheetId: ISheet['id']
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

const DownloadContainer = styled.div`
  cursor: ${ ({ isDownloadPrepared }: IDownloadContainer) => isDownloadPrepared ? 'pointer' : 'not-allowed'};
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
    background-color: ${ ({ isDownloadPrepared, containerBackgroundColor }: IDownloadContainer) => isDownloadPrepared ? containerBackgroundColor : 'auto'};
    color: ${ ({ isDownloadPrepared }: IDownloadContainer) => isDownloadPrepared ? 'white' : 'rgb(80, 80, 80)'};
  }
`
interface IDownloadContainer {
  isDownloadPrepared: boolean
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

const DownloadButton = styled.div`
  cursor: pointer;
  padding: 0.325rem 0.4rem;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 5px;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IDownloadButton) => containerBackgroundColor};
    color: white;
  }
`
interface IDownloadButton {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionDownloadSheet
