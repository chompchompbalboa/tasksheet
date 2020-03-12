//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT } from '@/assets/icons'

import { ISheetPhoto } from '@/state/sheet/types'
import { 
  ISheetCellPhotosDeleteStatus,
  ISheetCellPhotosUploadStatus 
} from '@desktop/Sheet/SheetCellPhotos'

import Icon from '@/components/Icon'
import SheetCellPhotosDropdownHeader from '@desktop/Sheet/SheetCellPhotosDropdownHeader'
import SheetCellPhotosDropdownPhoto from '@desktop/Sheet/SheetCellPhotosDropdownPhoto'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotosDropdown = ({
  activeSheetCellPhoto,
  activeSheetCellPhotoIndex,
  deleteActiveSheetCellPhoto,
  deleteActiveSheetCellPhotoStatus,
  downloadActiveSheetCellPhoto,
  openPhotoUploadDialog,
  setActiveSheetCellPhotoIndex,
  sheetCellPhotos,
  uploadSheetCellPhotoProgress,
  uploadSheetCellPhotoStatus
}: SheetCellPhotosDropdownProps) => {
  
  const uploadSheetCellPhotoStatusMessages = {
    READY: 'Click here to upload a photo',
    NEED_AN_ACCOUNT_TO_UPLOAD: 'You need an active subscription to upload photos',
    PREPARING_UPLOAD: 'Preparing Upload...',
    UPLOADING: 'Uploading',
    SAVING_FILE_DATA: 'Saving File Data...',
    UPLOADED: 'Uploaded!',
  }

  const uploadSheetCellPhotosProgressMessages = (uploadSheetCellPhotoStatus: ISheetCellPhotosUploadStatus) => {
    const percentages = {
      READY: '',
      NEED_AN_ACCOUNT_TO_UPLOAD: '',
      PREPARING_UPLOAD: '',
      UPLOADING: uploadSheetCellPhotoProgress + '%',
      SAVING_FILE_DATA: '',
      UPLOADED: '',
    }
    return percentages[uploadSheetCellPhotoStatus]
  }

  const isArrowsVisible = sheetCellPhotos && sheetCellPhotos.length > 1
  const leftArrowIndex = sheetCellPhotos ? activeSheetCellPhotoIndex - 1 < 0 ? sheetCellPhotos.length - 1 : activeSheetCellPhotoIndex - 1 : 0
  const rightArrowIndex = sheetCellPhotos ? activeSheetCellPhotoIndex + 1 === sheetCellPhotos.length ? 0 : activeSheetCellPhotoIndex + 1 : 0

  return (
    <Container>
      <LeftArrow 
        isVisible={isArrowsVisible}
        onClick={sheetCellPhotos ? () => setActiveSheetCellPhotoIndex(leftArrowIndex) : null}>
        <Icon 
          icon={ARROW_LEFT}/>
      </LeftArrow>
      <Photos>
        {sheetCellPhotos && activeSheetCellPhoto && 
          <SheetCellPhotosDropdownHeader
            activeSheetCellPhoto={activeSheetCellPhoto}
            deleteActiveSheetCellPhoto={deleteActiveSheetCellPhoto}
            deleteActiveSheetCellPhotoStatus={deleteActiveSheetCellPhotoStatus}
            downloadActiveSheetCellPhoto={downloadActiveSheetCellPhoto}
            openPhotoUploadDialog={openPhotoUploadDialog}
            uploadSheetCellPhotoProgress={uploadSheetCellPhotoProgress}
            uploadSheetCellPhotoStatus={uploadSheetCellPhotoStatus}/>
        }
        <PhotoContainer
          numberOfPhotos={sheetCellPhotos && sheetCellPhotos.length || 0}>
          {sheetCellPhotos && sheetCellPhotos.length > 0 && activeSheetCellPhoto
            ? <SheetCellPhotosDropdownPhoto
                sheetPhoto={activeSheetCellPhoto}/>
            : <NoPhotoMessage
                onClick={() => openPhotoUploadDialog()}>
                {uploadSheetCellPhotoStatusMessages[uploadSheetCellPhotoStatus]} {uploadSheetCellPhotosProgressMessages(uploadSheetCellPhotoStatus)}
              </NoPhotoMessage>
        }
        </PhotoContainer>
      </Photos>
      <RightArrow 
        isVisible={isArrowsVisible}
        onClick={sheetCellPhotos ? () => setActiveSheetCellPhotoIndex(rightArrowIndex) : null}>
        <Icon 
          icon={ARROW_RIGHT}/>
      </RightArrow>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosDropdownProps {
  activeSheetCellPhoto: ISheetPhoto
  activeSheetCellPhotoIndex: number
  deleteActiveSheetCellPhoto(): void
  deleteActiveSheetCellPhotoStatus: ISheetCellPhotosDeleteStatus
  downloadActiveSheetCellPhoto(): void
  openPhotoUploadDialog(): void
  setActiveSheetCellPhotoIndex(nextActiveSheetCellPhotoIndex: number): void
  sheetCellPhotos: ISheetPhoto[]
  uploadSheetCellPhotoProgress: number
  uploadSheetCellPhotoStatus: ISheetCellPhotosUploadStatus
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: absolute;
  top: calc(100% + 2.5px);
  left: -4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(245, 245, 245);
  color: black;
  border-radius: 5px;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`

const Arrow = styled.div`
  width: 2rem;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(245, 245, 245);
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const LeftArrow = styled(Arrow)`
  cursor: ${ ({ isVisible }: IArrow) => isVisible ? 'pointer' : 'default' };
  opacity: ${ ({ isVisible }: IArrow) => isVisible ? '1' : '0' };
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const RightArrow = styled(Arrow)`
  cursor: ${ ({ isVisible }: IArrow) => isVisible ? 'pointer' : 'default' };
  opacity: ${ ({ isVisible }: IArrow) => isVisible ? '1' : '0' };
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`
interface IArrow {
  isVisible: boolean
}

const Photos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PhotoContainer = styled.div`
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${ ({ numberOfPhotos }: IPhotoContainer ) => numberOfPhotos > 0 ? 'calc(50vw - 4rem)' : 'calc(40vw - 4rem)'};
  height: calc(70vh - 4.75rem);
`
interface IPhotoContainer {
  numberOfPhotos: number
}

const NoPhotoMessage = styled.div`
  margin-top: 1rem;
  cursor: pointer;
  width: 100%;
  height: calc(100% - 3rem);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotosDropdown
