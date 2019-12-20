//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { ISheetPhoto } from '@app/state/sheet/types'
import { ISheetCellPhotosUploadStatus } from '@app/bundles/Sheet/SheetCellPhotos'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotosPhotos = ({
  activeSheetCellPhoto,
  openPhotosInput,
  uploadProgress,
  uploadStatus
}: SheetCellPhotosPhotosProps) => {
  
  const uploadStatusMessages = {
    READY: 'Add Photo',
    PREPARING_UPLOAD: 'Preparing Upload...',
    UPLOADING: 'Uploading',
    SAVING_SHEET_CELL_PHOTO: 'Saving File Data...',
    UPLOADED: 'Uploaded!',
  }

  const progressPercentage = (uploadStatus: ISheetCellPhotosUploadStatus) => {
    const percentages = {
      READY: '',
      PREPARING_UPLOAD: '',
      UPLOADING: uploadProgress + '%',
      SAVING_SHEET_CELL_PHOTO: '',
      UPLOADED: '',
    }
    return percentages[uploadStatus]
  }

  return (
    <PhotoHeader>
      <PhotoLabel>
        <UploadedBy>{activeSheetCellPhoto.uploadedBy}</UploadedBy>
        <UploadedAt>{moment(activeSheetCellPhoto.uploadedAt).format('MMMM Do, YYYY')}</UploadedAt>
      </PhotoLabel>
      <UploadPhotoButton
        onClick={() => openPhotosInput()}>
        {uploadStatusMessages[uploadStatus]} {progressPercentage(uploadStatus)}
      </UploadPhotoButton>
    </PhotoHeader>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosPhotosProps {
  activeSheetCellPhoto: ISheetPhoto
  openPhotosInput(): void
  prepareUploadProgress: number
  uploadProgress: number
  uploadStatus: ISheetCellPhotosUploadStatus
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const PhotoHeader = styled.div`
  width: 100%;
  margin-top: -2rem;
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PhotoLabel = styled.div`
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

const UploadPhotoButton = styled.div`
  cursor: pointer;
  padding: 0.25rem 1.5rem;
  background-color: rgba(180, 180, 180, 0.25);
  border-radius: 5px;
  transition: background-color 0.15s;
  &:hover {
    background-color: rgba(180, 180, 180, 0.5);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotosPhotos
