//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { storeFileToS3 } from '@/api/vapor'
import { mutation } from '@/api'

import { IAppState } from '@/state'
import { ISheetFile } from '@/state/sheet/types'
import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import { 
  createSheetCellFile,
  deleteSheetCellFile as deleteSheetCellFileAction,
  updateSheetCell
} from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'
import SheetCellFilesDropdown from '@desktop/Sheet/SheetCellFilesDropdown'
import SheetCellFilesValue from '@desktop/Sheet/SheetCellFilesValue'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellFiles = ({
  sheetId,
  cell
}: ISheetCellTypesSharedProps) => {

  // Refs
  const uploadInput = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const sheetCellFiles = useSelector((state: IAppState) => state.sheet.allSheetCellFiles && state.sheet.allSheetCellFiles[cell.id] && state.sheet.allSheetCellFiles[cell.id].map((sheetFileId: ISheetFile['id']) => {
    return state.sheet.allSheetFiles[sheetFileId]
  }))
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)

  // State
  const [ uploadSheetCellFileStatus, setUploadSheetCellFileStatus ] = useState('READY' as ISheetCellFilesUploadStatus)
  const [ uploadSheetCellFileProgress, setUploadSheetCellFileProgress ] = useState(0)

  // Local Variables
  const isCellSelected = cell.isCellSelectedSheetIds.has(sheetId)
  const isCellInRange = sheetSelectionsRangeCellIds.has(cell.id)
  
  // Effects
  useEffect(() => {
    if(sheetCellFiles && cell && cell.value && (sheetCellFiles.length + '') !== (cell.value + '')) {
      dispatch(updateSheetCell(cell.id, { value: (sheetCellFiles && sheetCellFiles.length + '') || '0' }))
    }
  })

  // Download Sheet Cell File
  const downloadSheetCellFile = (sheetCellFileId: ISheetFile['id']) => {
    const url = '/app/sheets/cells/files/download/' + sheetCellFileId
    window.open(url, '_blank')
  }

  // Delete Sheet Cell File
  const deleteSheetCellFile = (sheetCellFileId: ISheetFile['id']) => {
    dispatch(deleteSheetCellFileAction(cell.id, sheetCellFileId))
  }

  // Open File Upload Dialog
  const openFileUploadDialog = () => {
    uploadInput.current.click()
  }
  
  // Upload Sheet Cell File
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
        mutation.createSheetCellFile(sheetId, cell.id, file.name, s3PresignedUrlData, uploadedAt).then(nextSheetCellFiles => {
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
      cell={cell}
      beginEditing={() => null}
      completeEditing={() => null}
      onlyRenderChildren
      value={null}>
      <Container>
        <SheetCellFilesValue
          value={(sheetCellFiles && sheetCellFiles.length || 0) + ''}/>
        {isCellSelected && !isCellInRange &&
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
