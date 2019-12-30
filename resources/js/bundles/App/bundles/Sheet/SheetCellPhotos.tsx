//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { mutation } from '@app/api'
import { storeFileToS3 } from '@/api/vapor'

import { IAppState } from '@app/state'
import { ISheetCell, ISheetPhoto } from '@app/state/sheet/types'
import { 
  createSheetCellPhoto,
  deleteSheetCellPhoto
} from '@app/state/sheet/actions'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'
import SheetCellPhotosDropdown from '@app/bundles/Sheet/SheetCellPhotosDropdown'
import SheetCellPhotosValue from '@app/bundles/Sheet/SheetCellPhotosValue'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotos = ({
  sheetId,
  cellId,
  cell,
  isCellInRange,
  isCellSelected,
  updateCellValue,
  ...passThroughProps
}: SheetCellPhotosProps) => {

  // Refs
  const uploadInput = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const sheetCellPhotos = useSelector((state: IAppState) => state.sheet.allSheetCellPhotos && state.sheet.allSheetCellPhotos[cellId] && state.sheet.allSheetCellPhotos[cellId].map((sheetPhotoId: ISheetPhoto['id']) => {
    return state.sheet.allSheetPhotos[sheetPhotoId]
  }))

  // State
  const [ deleteActiveSheetCellPhotoStatus, setDeleteActiveSheetCellPhotoStatus ] = useState('READY' as ISheetCellPhotosDeleteStatus)
  const [ uploadSheetCellPhotoProgress, setUploadSheetCellPhotoProgress ] = useState(0)
  const [ uploadSheetCellPhotoStatus, setUploadSheetCellPhotoStatus ] = useState('READY' as ISheetCellPhotosUploadStatus)
  const [ activeSheetCellPhotoIndex, setActiveSheetCellPhotoIndex ] = useState(0)

  // Active Sheet Cell Photo
  const activeSheetCellPhoto = sheetCellPhotos && sheetCellPhotos[activeSheetCellPhotoIndex]

  // Timeouts
  let beforePhotoDeleteTimeout = useRef(null)
  let deleteActiveSheetCellPhotoTimeout = useRef(null)
  let setDeleteActiveSheetCellPhotoStatusToDeletedTimeout = useRef(null)
  let setDeleteActiveSheetCellPhotoStatusToReadyTimeout = useRef(null)
  
  // Effects
  useEffect(() => {
    if(sheetCellPhotos && cell && cell.value && (sheetCellPhotos.length + '') !== (cell.value + '')) {
      updateCellValue((sheetCellPhotos && sheetCellPhotos.length + '') || '0')
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
    setDeleteActiveSheetCellPhotoStatus('DELETING')
    beforePhotoDeleteTimeout.current = setTimeout(() => setActiveSheetCellPhotoIndex(Math.max(0, activeSheetCellPhotoIndex - 1)), 250)
    deleteActiveSheetCellPhotoTimeout.current = setTimeout(() => dispatch(deleteSheetCellPhoto(activeSheetCellPhoto.cellId, activeSheetCellPhoto.id)), 350)
    setDeleteActiveSheetCellPhotoStatusToDeletedTimeout.current = setTimeout(() => setDeleteActiveSheetCellPhotoStatus('DELETED'), 350)
    setDeleteActiveSheetCellPhotoStatusToReadyTimeout.current = setTimeout(() => setDeleteActiveSheetCellPhotoStatus('READY'), 1350)
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
    const photosList = e.target.files
    const photosIndexes = Object.keys(photosList)
    const photosToUpload = photosIndexes.map((index: any) => photosList[index])
    if(photosIndexes.length > 0) {
      const file = photosToUpload[0]
      const uploadedAt = moment().format('YYYY-MM-DD HH:mm:ss')
      setUploadSheetCellPhotoStatus('PREPARING_UPLOAD')
      storeFileToS3(file, () => setUploadSheetCellPhotoStatus('UPLOADING'), setUploadSheetCellPhotoProgress).then(s3PresignedUrlData => {
        setUploadSheetCellPhotoStatus('SAVING_FILE_DATA')
        mutation.createSheetCellPhoto(sheetId, cellId, file.name, s3PresignedUrlData, uploadedAt).then(nextSheetCellPhotos => {
          const newSheetCellPhoto = nextSheetCellPhotos[nextSheetCellPhotos.length - 1]
          setUploadSheetCellPhotoStatus('UPLOADED')
          setUploadSheetCellPhotoProgress(0)
          dispatch(createSheetCellPhoto(cellId, newSheetCellPhoto))
          setTimeout(() => setActiveSheetCellPhotoIndex(0), 25)
          setTimeout(() => setUploadSheetCellPhotoStatus('READY'), 1000)
        })
      })
    }
  }

  return (
    <SheetCellContainer
      testId="SheetCellPhotos"
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
interface SheetCellPhotosProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellSelected: boolean
  isCellInRange: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

export type ISheetCellPhotosUploadStatus = 
  'READY' | 
  'PREPARING_UPLOAD' | 
  'UPLOADING' | 
  'SAVING_FILE_DATA' | 
  'UPLOADED'

export type ISheetCellPhotosDeleteStatus = 
  'READY' |
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
