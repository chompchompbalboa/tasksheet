//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { DOWNLOAD, FILES, CLOSE } from '@app/assets/icons'

import { mutation, query } from '@app/api'

import { SheetCell, SheetColumnType } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellFiles = ({
  sheetId,
  cellId,
  cell,
  updateCellValue,
  ...passThroughProps
}: SheetCellFilesProps) => {

  // Refs
  const container = useRef(null)
  const uploadInput = useRef(null)

  // State
  const [ hasFilesLoaded, setHasFilesLoaded ] = useState(false)
  const [ files, setFiles ] = useState([])
  const [ isFilesVisible, setIsFilesVisible ] = useState(false)
  const [ uploadStatus, setUploadStatus ] = useState('READY' as TUploadStatus)

  useEffect(() => {
    if(isFilesVisible) { 
      addEventListener('click', closeOnClickOutside)
      if(!hasFilesLoaded) {
        query.getSheetCellFiles(cellId).then(filesFromServer => {
          setHasFilesLoaded(true)
          setFiles(filesFromServer)
        })
      }
    }
    else { removeEventListener('click', closeOnClickOutside) }
    return () => removeEventListener('click', closeOnClickOutside)
  }, [ isFilesVisible ])
  
  useEffect(() => {
    return () => {
      setIsFilesVisible(false)
    }
  }, [])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsFilesVisible(false)
    }
  }

  const handleContainerClick = () => {
    setIsFilesVisible(true)
  }
  
  const handleUploadFilesButtonClick = () => {
    uploadInput.current.click()
  }
  
  const handleUploadInputSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files
    const filesIndexes = Object.keys(filesList)
    if(filesIndexes.length > 0) {
      setUploadStatus('UPLOADING')
      const filesToUpload = filesIndexes.map((index: any) => filesList[index])
      mutation.createSheetCellFiles(sheetId, cellId, filesToUpload).then(nextSheetCellFiles => {
        setFiles(nextSheetCellFiles)
        setUploadStatus('UPLOADED')
        updateCellValue(nextSheetCellFiles.length)
        setTimeout(() => setUploadStatus('READY'), 1000)
      })
    }
  }

  const handleFileDownloadClick = (sheetFileId: string) => {
    const url = '/app/sheets/cells/files/download/' + sheetFileId
    window.open(url, '_blank')
  }

  const handleFileDeleteClick = (sheetFileId: string) => {
    setUploadStatus('DELETING')
    mutation.deleteSheetCellFile(sheetFileId).then(nextSheetCellFiles => {
      setUploadStatus('DELETED')
      setFiles(nextSheetCellFiles)
      updateCellValue(nextSheetCellFiles.length)
      setTimeout(() => setUploadStatus('READY'), 1000)
    })
  }
  
  const uploadStatusMessages = {
    READY: 'Add files',
    UPLOADING: 'Uploading...',
    UPLOADED: 'Uploaded!',
    DELETING: 'Deleting...',
    DELETED: 'Deleted'
  }

  return (
    <SheetCellContainer
      sheetId={sheetId}
      cellId={cellId}
      cell={cell}
      focusCell={() => null}
      onlyRenderChildren
      updateCellValue={() => null}
      value={null}
      {...passThroughProps}>
      <Container
        ref={container}
        onClick={() => handleContainerClick()}>
        <IconContainer>
          <Icon 
            icon={FILES}
            size="18px"/>
          <FileCount>
            ({ cell.value || 0 })
          </FileCount>
        </IconContainer>
        {isFilesVisible &&
          <FilesDropdown>
            <FileHeader>
              <UploadFileButton
                onClick={() => handleUploadFilesButtonClick()}>
                {uploadStatusMessages[uploadStatus]}
              </UploadFileButton>
            </FileHeader>
            <Files>
              {hasFilesLoaded && files.length > 0 &&
                files.map((file, index) => (
                  <File
                    key={index}>
                    <FileName>{file.filename}</FileName>
                    <FileActions>
                      <FileAction
                        onClick={() => handleFileDownloadClick(file.id)}>
                        <Icon icon={DOWNLOAD}/>
                      </FileAction>
                      <FileAction
                        onClick={() => handleFileDeleteClick(file.id)}>
                        <Icon icon={CLOSE}/>
                      </FileAction>
                    </FileActions>
                  </File>
                ))
            }
            </Files>
          </FilesDropdown>
        }
      </Container>
      <UploadInput
        ref={uploadInput}
        type="file"
        multiple
        onChange={e => handleUploadInputSelect(e)}/>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellFilesProps {
  sheetId: string
  cell: SheetCell
  cellId: string
  columnType: SheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectionFromArrowKey(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

type TUploadStatus = 'READY' | 'UPLOADING' | 'UPLOADED' | 'DELETING' | 'DELETED'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
`

const IconContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: rgb(100, 100, 100);
  &:hover {
    color: rgb(60, 60, 60);
  }
`

const FileCount = styled.div`
  font-weight: bold;
`

const FilesDropdown = styled.div`
  position: absolute;
  top: calc(100% + 2.5px);
  left: -4px;
  background-color: rgb(245, 245, 245);
  width: 35vw;
  height: 60vh;
  border-radius: 10px;
  border-top-left-radius: 0;
  padding: 2rem;
  padding-top: 0rem;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const Files = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`


const FileHeader = styled.div`
  width: 100%;
  padding: 1rem 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const UploadFileButton = styled.div`
  cursor: pointer;
  padding: 0.25rem 1.5rem;
  background-color: rgba(180, 180, 180, 0.25);
  border-radius: 5px;
  transition: background-color 0.15s;
  &:hover {
    background-color: rgba(180, 180, 180, 0.5);
  }
`

const File = styled.div`
  cursor: pointer;
  width: 100%;
  padding: 0.5rem;
  transition: background-color 0.15s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: rgb(225, 225, 225);
  }
`

const FileName = styled.div``

const FileActions = styled.div`
  display: flex;
  align-items: center;
`

const FileAction = styled.div`
  margin: 0.5rem;
  color: rgb(120, 120, 120);
  &:hover {
    color: rgb(0, 0, 0);
  }
`

const UploadInput = styled.input`
  display: none;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellFiles
