//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { mutation } from '@/api'
import { storeFileToS3 } from '@/api/vapor'

import { IAppState } from '@/state'
import { ISheetPhoto } from '@/state/sheet/types'
import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import { 
  createSheetCellPhoto,
  deleteSheetCellPhoto,
  updateSheetCell
} from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'
import SheetCellPhotosDropdown from '@desktop/Sheet/SheetCellPhotosDropdown'
import SheetCellPhotosValue from '@desktop/Sheet/SheetCellPhotosValue'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotos = ({
  sheetId,
  cell
}: ISheetCellTypesSharedProps) => {

  // Refs
  const uploadInput = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const isDemoUser = useSelector((state: IAppState) => state.user.tasksheetSubscription.type === 'DEMO')
  const sheetCellPhotos = useSelector((state: IAppState) => state.sheet.allSheetCellPhotos && state.sheet.allSheetCellPhotos[cell.id] && state.sheet.allSheetCellPhotos[cell.id].map((sheetPhotoId: ISheetPhoto['id']) => {
    return state.sheet.allSheetPhotos[sheetPhotoId]
  }))
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)

  // State
  const [ deleteActiveSheetCellPhotoStatus, setDeleteActiveSheetCellPhotoStatus ] = useState('READY' as ISheetCellPhotosDeleteStatus)
  const [ uploadSheetCellPhotoProgress, setUploadSheetCellPhotoProgress ] = useState(0)
  const [ uploadSheetCellPhotoStatus, setUploadSheetCellPhotoStatus ] = useState('READY' as ISheetCellPhotosUploadStatus)
  const [ activeSheetCellPhotoIndex, setActiveSheetCellPhotoIndex ] = useState(0)

  // Local Variables
  const activeSheetCellPhoto = sheetCellPhotos && sheetCellPhotos[activeSheetCellPhotoIndex]
  const isCellSelected = cell.isCellSelectedSheetIds.has(sheetId)
  const isCellInRange = sheetSelectionsRangeCellIds.has(cell.id)

  // Timeouts
  let beforePhotoDeleteTimeout = useRef(null)
  let deleteActiveSheetCellPhotoTimeout = useRef(null)
  let setDeleteActiveSheetCellPhotoStatusToDeletedTimeout = useRef(null)
  let setDeleteActiveSheetCellPhotoStatusToReadyTimeout = useRef(null)
  
  // Effects
  useEffect(() => {
    if(sheetCellPhotos && cell && cell.value && (sheetCellPhotos.length + '') !== (cell.value + '')) { // If the number of photos has changed
      dispatch(updateSheetCell(cell.id, { value: (sheetCellPhotos && sheetCellPhotos.length + '') || '0' })) // Update the cell value
    }
  })
  
  useEffect(() => {
    return () => {
      clearTimeout(beforePhotoDeleteTimeout.current)
      clearTimeout(deleteActiveSheetCellPhotoTimeout.current)
      clearTimeout(setDeleteActiveSheetCellPhotoStatusToDeletedTimeout.current)
      clearTimeout(setDeleteActiveSheetCellPhotoStatusToReadyTimeout.current)
    }
  }, [])
  
  // Delete Photo
  const deleteActiveSheetCellPhoto = () => {
    if(!isDemoUser) {
      setDeleteActiveSheetCellPhotoStatus('DELETING')
      beforePhotoDeleteTimeout.current = setTimeout(() => setActiveSheetCellPhotoIndex(Math.max(0, activeSheetCellPhotoIndex - 1)), 250)
      deleteActiveSheetCellPhotoTimeout.current = setTimeout(() => dispatch(deleteSheetCellPhoto(activeSheetCellPhoto.cellId, activeSheetCellPhoto.id)), 350)
      setDeleteActiveSheetCellPhotoStatusToDeletedTimeout.current = setTimeout(() => setDeleteActiveSheetCellPhotoStatus('DELETED'), 350)
      setDeleteActiveSheetCellPhotoStatusToReadyTimeout.current = setTimeout(() => setDeleteActiveSheetCellPhotoStatus('READY'), 1350)
    }
    else {
      setDeleteActiveSheetCellPhotoStatus('NEED_AN_ACCOUNT_TO_DELETE')
      setTimeout(() => setDeleteActiveSheetCellPhotoStatus('READY'), 5000)
    }
  }

  // Download Photo
  const downloadActiveSheetCellPhoto = () => {
    const url = '/app/sheets/cells/photos/download/' + activeSheetCellPhoto.id
    window.open(url, '_blank')
  }
  
  // Open Photo Upload Dialog
  const openPhotoUploadDialog = () => {
    uploadInput.current.click()
  }
  
  // Upload Photo
  const uploadSheetCellPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if(!isDemoUser) {
      const photosList = e.target.files
      const photosIndexes = Object.keys(photosList)
      const photosToUpload = photosIndexes.map((index: any) => photosList[index])
      if(photosIndexes.length > 0) {
        const file = photosToUpload[0]
        const uploadedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        setUploadSheetCellPhotoStatus('PREPARING_UPLOAD')
        storeFileToS3(file, () => setUploadSheetCellPhotoStatus('UPLOADING'), setUploadSheetCellPhotoProgress)
          .then(s3PresignedUrlData => {
            setUploadSheetCellPhotoStatus('SAVING_FILE_DATA')
            mutation.createSheetCellPhoto(sheetId, cell.id, file.name, s3PresignedUrlData, uploadedAt).then(nextSheetCellPhotos => {
              const newSheetCellPhoto = nextSheetCellPhotos[nextSheetCellPhotos.length - 1]
              setUploadSheetCellPhotoStatus('UPLOADED')
              setUploadSheetCellPhotoProgress(0)
              dispatch(createSheetCellPhoto(cell.id, newSheetCellPhoto))
              setTimeout(() => setActiveSheetCellPhotoIndex(0), 25)
              setTimeout(() => setUploadSheetCellPhotoStatus('READY'), 1000)
            })
          })
          .catch(console.log.bind(console))
      }
    }
    else {
      setUploadSheetCellPhotoStatus('NEED_AN_ACCOUNT_TO_UPLOAD')
      setTimeout(() => setUploadSheetCellPhotoStatus('READY'), 5000)
    }
  }

  return (
    <SheetCellContainer
      testId="SheetCellPhotos"
      sheetId={sheetId}
      cell={cell}
      beginEditing={() => null}
      completeEditing={() => null}
      onlyRenderChildren
      value={null}>
      <Container>
        <SheetCellPhotosValue
          value={(sheetCellPhotos && sheetCellPhotos.length || 0) + ''}/>
        {isCellSelected && !isCellInRange &&
          <SheetCellPhotosDropdown
            activeSheetCellPhoto={activeSheetCellPhoto}
            activeSheetCellPhotoIndex={activeSheetCellPhotoIndex}
            deleteActiveSheetCellPhoto={deleteActiveSheetCellPhoto}
            deleteActiveSheetCellPhotoStatus={deleteActiveSheetCellPhotoStatus}
            downloadActiveSheetCellPhoto={downloadActiveSheetCellPhoto}
            openPhotoUploadDialog={openPhotoUploadDialog}
            setActiveSheetCellPhotoIndex={setActiveSheetCellPhotoIndex}
            sheetCellPhotos={sheetCellPhotos}
            uploadSheetCellPhotoProgress={uploadSheetCellPhotoProgress}
            uploadSheetCellPhotoStatus={uploadSheetCellPhotoStatus}/>}
      </Container>
      <UploadInput
        ref={uploadInput}
        type="file"
        accept="image/*"
        multiple
        onChange={e => uploadSheetCellPhoto(e)}/>
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type ISheetCellPhotosUploadStatus = 
  'READY' | 
  'NEED_AN_ACCOUNT_TO_UPLOAD' |
  'PREPARING_UPLOAD' | 
  'UPLOADING' | 
  'SAVING_FILE_DATA' | 
  'UPLOADED'

export type ISheetCellPhotosDeleteStatus = 
  'READY' |
  'NEED_AN_ACCOUNT_TO_DELETE' |
  'DELETING' |
  'DELETED'

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
export default SheetCellPhotos
