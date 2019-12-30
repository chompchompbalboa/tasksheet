//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { storeFileToS3 } from '@/api/vapor'
import { mutation } from '@app/api'

import { IAppState } from '@app/state'
import { ISheetCell, ISheetFile } from '@app/state/sheet/types'
import { 
  createSheetCellFile,
  deleteSheetCellFile as deleteSheetCellFileAction
} from '@app/state/sheet/actions'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'
import SheetCellFilesDropdown from '@app/bundles/Sheet/SheetCellFilesDropdown'
import SheetCellFilesValue from '@app/bundles/Sheet/SheetCellFilesValue'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellFiles = ({
  sheetId,
  cellId,
  cell,
  isCellSelected,
  updateCellValue,
  ...passThroughProps
}: ISheetCellFiles) => {

  // Refs
  const uploadInput = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const sheetCellFiles = useSelector((state: IAppState) => state.sheet.allSheetCellFiles && state.sheet.allSheetCellFiles[cellId] && state.sheet.allSheetCellFiles[cellId].map((sheetFileId: ISheetFile['id']) => {
    return state.sheet.allSheetFiles[sheetFileId]
  }))
  
  // Effects
  useEffect(() => {
    if(sheetCellFiles && cell && cell.value && (sheetCellFiles.length + '') !== (cell.value + '')) {
      updateCellValue((sheetCellFiles && sheetCellFiles.length + '') || '0')
    }
  })

  // State
  const [ uploadSheetCellFileStatus, setUploadSheetCellFileStatus ] = useState('READY' as ISheetCellFilesUploadStatus)
  const [ uploadSheetCellFileProgress, setUploadSheetCellFileProgress ] = useState(0)

  // Handle File Download
  const downloadSheetCellFile = (sheetCellFileId: ISheetFile['id']) => {
    const url = '/app/sheets/cells/files/download/' + sheetCellFileId
    window.open(url, '_blank')
  }

  // Handle File Delete
  const deleteSheetCellFile = (sheetCellFileId: ISheetFile['id']) => {
    dispatch(deleteSheetCellFileAction(cellId, sheetCellFileId))
  }

  // Open File Upload Dialog
  const openFileUploadDialog = () => {
    uploadInput.current.click()
  }
  
  // Handle File Upload
  const uploadSheetCellFile = (e: ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files
    const filesIndexes = Object.keys(filesList)
    const filesToUpload = filesIndexes.map((index: any) => filesList[index])
    if(filesIndexes.length > 0) {
      const file = filesToUpload[0]
      setUploadSheetCellFileStatus('PREPARING_UPLOAD')
      storeFileToS3(file, () => setUploadSheetCellFileStatus('UPLOADING'), setUploadSheetCellFileProgress).then(s3PresignedUrlData => {
        const uploadedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        setUploadSheetCellFileStatus('SAVING_FILE_DATA')
        mutation.createSheetCellFile(sheetId, cellId, file.name, s3PresignedUrlData, uploadedAt).then(nextSheetCellFiles => {
          const newSheetCellFile = nextSheetCellFiles[nextSheetCellFiles.length - 1]
          dispatch(createSheetCellFile(newSheetCellFile.cellId, newSheetCellFile))
          setUploadSheetCellFileProgress(0)
          if(nextSheetCellFiles.length === 1) {
            setUploadSheetCellFileStatus('READY')
          }
          else {
            setUploadSheetCellFileStatus('UPLOADED')
            setTimeout(() => setUploadSheetCellFileStatus('READY'), 1000)
          }
        })
      })
    }
  }

  return (
    <SheetCellContainer
      testId="SheetCellFiles"
      sheetId={sheetId}
      cellId={cellId}
      cell={cell}
      focusCell={() => null}
      isCellSelected={isCellSelected}
      onlyRenderChildren
      preventValueChangeWhileSelected
      value={null}
      {...passThroughProps}>
      <Container>
        <SheetCellFilesValue
          value={(sheetCellFiles && sheetCellFiles.length || 0) + ''}/>
        {isCellSelected &&
          <SheetCellFilesDropdown
            downloadSheetCellFile={downloadSheetCellFile}
            deleteSheetCellFile={deleteSheetCellFile}
            openFileUploadDialog={openFileUploadDialog}
            sheetCellFiles={sheetCellFiles}
            uploadSheetCellFileProgress={uploadSheetCellFileProgress}
            uploadSheetCellFileStatus={uploadSheetCellFileStatus}/>}
      </Container>
      <UploadInput
        ref={uploadInput}
        type="file"
        onChange={e => uploadSheetCellFile(e)}/>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellFiles {
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellInRange: boolean
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

export type ISheetCellFilesUploadStatus = 
  'READY' | 
  'PREPARING_UPLOAD' | 
  'UPLOADING'| 
  'SAVING_FILE_DATA' | 
  'UPLOADED'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  height: 100%;
`

const UploadInput = styled.input`
  display: none;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellFiles
