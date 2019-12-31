//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { DOWNLOAD, PLUS_SIGN, TRASH_CAN } from '@/assets/icons'

import { ISheetPhoto } from '@/state/sheet/types'
import { 
  ISheetCellPhotosDeleteStatus,
  ISheetCellPhotosUploadStatus 
} from '@desktop/Sheet/SheetCellPhotos'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotosDropdownHeader = ({
  activeSheetCellPhoto,
  deleteActiveSheetCellPhoto,
  deleteActiveSheetCellPhotoStatus,
  downloadActiveSheetCellPhoto,
  openPhotoUploadDialog,
  uploadSheetCellPhotoProgress,
  uploadSheetCellPhotoStatus
}: SheetCellPhotosDropdownHeaderProps) => {
  
  // Delete Sheet Cell Photo Status Messages
  const deleteSheetCellPhotoStatusMessages = {
    READY: <Icon icon={TRASH_CAN} size="0.85rem"/>,
    DELETING: 'Deleting...',
    DELETED: 'Deleted!',
  }
  
  // Upload Sheet Cell Photo Status Messages
  const uploadSheetCellPhotoStatusMessages = {
    READY: <Icon icon={PLUS_SIGN} size="0.85rem"/>,
    PREPARING_UPLOAD: 'Preparing Upload...',
    UPLOADING: 'Uploading',
    SAVING_FILE_DATA: 'Saving File Data...',
    UPLOADED: 'Uploaded!',
  }
  
  // Upload Sheet Cell Photo Progress Percentage Messages
  const uploadSheetCellPhotoProgressPercentageMessages = (uploadSheetCellPhotoStatus: ISheetCellPhotosUploadStatus) => {
    const progressPercentages = {
      READY: '',
      PREPARING_UPLOAD: '',
      UPLOADING: uploadSheetCellPhotoProgress + '%',
      SAVING_FILE_DATA: '',
      UPLOADED: '',
    }
    return progressPercentages[uploadSheetCellPhotoStatus]
  }

  // Trim Active Sheet Cell Photo Filename To 30 Characters
  const filename = activeSheetCellPhoto.filename
  const filenameMaxLength = 50
  const trimmedFilename = filename.length > filenameMaxLength ? filename.substring(0, filenameMaxLength - 3) + "..." : filename.substring(0, filenameMaxLength)

  return (
    <Container>
      <Details>
        <Filename>{trimmedFilename}</Filename>
        <UploadDetails>{activeSheetCellPhoto.uploadedBy} / {moment(activeSheetCellPhoto.uploadedAt).format('MMMM Do, YYYY / hh:mma')}</UploadDetails>
      </Details>
      <Actions>
        <UploadPhotoButton
          onClick={() => openPhotoUploadDialog()}>
          {uploadSheetCellPhotoStatusMessages[uploadSheetCellPhotoStatus]} {uploadSheetCellPhotoProgressPercentageMessages(uploadSheetCellPhotoStatus)}
        </UploadPhotoButton>
        <DownloadPhotoButton
          onClick={() => downloadActiveSheetCellPhoto()}>
          <Icon icon={DOWNLOAD} size="0.85rem"/>
        </DownloadPhotoButton>
        <DeletePhotoButton
          onClick={() => deleteActiveSheetCellPhoto()}>
          {deleteSheetCellPhotoStatusMessages[deleteActiveSheetCellPhotoStatus]}
        </DeletePhotoButton>
      </Actions>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosDropdownHeaderProps {
  activeSheetCellPhoto: ISheetPhoto
  openPhotoUploadDialog(): void
  deleteActiveSheetCellPhoto(): void
  deleteActiveSheetCellPhotoStatus: ISheetCellPhotosDeleteStatus
  downloadActiveSheetCellPhoto(): void
  uploadSheetCellPhotoProgress: number
  uploadSheetCellPhotoStatus: ISheetCellPhotosUploadStatus
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 5rem;
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

const Filename = styled.div`
  font-size: 0.85rem;
  font-weight: bold;
`

const UploadDetails = styled.div`
  font-size: 0.75rem;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const ActionButton = styled.div`
  cursor: pointer;
  margin-left: 0.25rem;
  padding: 0.375rem 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
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
const DownloadPhotoButton = styled(ActionButton)``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotosDropdownHeader
