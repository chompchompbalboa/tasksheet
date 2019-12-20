//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'

import { PLUS_SIGN, TRASH_CAN } from '@app/assets/icons'

import { ISheetPhoto } from '@app/state/sheet/types'
import { ISheetCellPhotosUploadStatus } from '@app/bundles/Sheet/SheetCellPhotos'
import { deleteSheetCellPhoto } from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotosPhotosHeader = ({
  activeSheetCellPhoto,
  beforePhotoDelete,
  openPhotosInput,
  sheetCellPhotos,
  updateCellValue,
  uploadProgress,
  uploadStatus
}: SheetCellPhotosPhotosHeaderProps) => {
  
  // Redux
  const dispatch = useDispatch()
  
  // State
  const [ deleteStatus, setDeleteStatus ] = useState('READY' as 'READY' | 'DELETING' | 'DELETED')
  
  // Timeouts
  let beforePhotoDeleteTimeout = useRef(null)
  let deletePhotoTimeout = useRef(null)
  let setDeleteStatusDeletedTimeout = useRef(null)
  let setDeleteStatusReadyTimeout = useRef(null)
  let updateCellValueTimeout = useRef(null)
  
  // Effects
  useEffect(() => {
    return () => {
      clearTimeout(beforePhotoDeleteTimeout.current)
      clearTimeout(deletePhotoTimeout.current)
      clearTimeout(setDeleteStatusDeletedTimeout.current)
      clearTimeout(setDeleteStatusReadyTimeout.current)
      clearTimeout(updateCellValueTimeout.current)
    }
  }, [])
  
  // Delete Status Messages
  const deleteStatusMessages = {
    READY: <Icon icon={TRASH_CAN} size="0.85rem"/>,
    DELETING: 'Deleting...',
    DELETED: 'Deleted!',
  }
  
  // Handle Delete Photo
  const handleDeletePhoto = () => {
    setDeleteStatus('DELETING')
    beforePhotoDeleteTimeout.current = setTimeout(() => beforePhotoDelete(), 250)
    deletePhotoTimeout.current = setTimeout(() => dispatch(deleteSheetCellPhoto(activeSheetCellPhoto.cellId, activeSheetCellPhoto.id)), 350)
    setDeleteStatusDeletedTimeout.current = setTimeout(() => setDeleteStatus('DELETED'), 350)
    setDeleteStatusDeletedTimeout.current = setTimeout(() => updateCellValue(Math.max(0, sheetCellPhotos.length - 1) + ''), 350)
    setDeleteStatusReadyTimeout.current = setTimeout(() => setDeleteStatus('READY'), 1350)
  }
  
  // Upload Status Messages
  const uploadStatusMessages = {
    READY: <Icon icon={PLUS_SIGN} size="0.85rem"/>,
    PREPARING_UPLOAD: 'Preparing Upload...',
    UPLOADING: 'Uploading',
    SAVING_SHEET_CELL_PHOTO: 'Saving File Data...',
    UPLOADED: 'Uploaded!',
  }
  
  // Upload Progress Percentages
  const uploadProgressPercentage = (uploadStatus: ISheetCellPhotosUploadStatus) => {
    const progressPercentages = {
      READY: '',
      PREPARING_UPLOAD: '',
      UPLOADING: uploadProgress + '%',
      SAVING_SHEET_CELL_PHOTO: '',
      UPLOADED: '',
    }
    return progressPercentages[uploadStatus]
  }

  return (
    <Container>
      <Details>
        <UploadedBy>{activeSheetCellPhoto.uploadedBy}</UploadedBy>
        <UploadedAt>{moment(activeSheetCellPhoto.uploadedAt).format('MMMM Do, YYYY / hh:mma')}</UploadedAt>
      </Details>
      <Actions>
        <UploadPhotoButton
          onClick={() => openPhotosInput()}>
          {uploadStatusMessages[uploadStatus]} {uploadProgressPercentage(uploadStatus)}
        </UploadPhotoButton>
        <DeletePhotoButton
          onClick={() => handleDeletePhoto()}>
          {deleteStatusMessages[deleteStatus]}
        </DeletePhotoButton>
      </Actions>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosPhotosHeaderProps {
  activeSheetCellPhoto: ISheetPhoto
  beforePhotoDelete(): void
  openPhotosInput(): void
  prepareUploadProgress: number
  sheetCellPhotos: ISheetPhoto[]
  updateCellValue(nextCellValue: string): void
  uploadProgress: number
  uploadStatus: ISheetCellPhotosUploadStatus
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  margin-top: -2rem;
  padding: 1rem 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const UploadedBy = styled.div`
  font-size: 0.85rem;
  font-weight: bold;
`

const UploadedAt = styled.div`
  font-size: 0.75rem;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const ActionButton = styled.div`
  cursor: pointer;
  margin-left: 0.5rem;
  padding: 0.375rem 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(180, 180, 180, 0.25);
  color: rgb(25, 25, 25);
  border-radius: 5px;
  transition: background-color 0.15s;
  &:hover {
    background-color: rgba(180, 180, 180, 0.5);
  }
`

const UploadPhotoButton = styled(ActionButton)``
const DeletePhotoButton = styled(ActionButton)``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotosPhotosHeader
