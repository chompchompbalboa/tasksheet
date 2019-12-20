//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT } from '@app/assets/icons'

import { ISheetPhoto } from '@app/state/sheet/types'
import { ISheetCellPhotosUploadStatus } from '@app/bundles/Sheet/SheetCellPhotos'

import Icon from '@/components/Icon'
import SheetCellPhotosPhotosHeader from '@app/bundles/Sheet/SheetCellPhotosPhotosHeader'
import SheetCellPhotosPhotosPhoto from '@app/bundles/Sheet/SheetCellPhotosPhotosPhoto'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotosPhotos = ({
  openPhotosInput,
  prepareUploadProgress,
  setVisiblePhotoIndex,
  sheetCellPhotos,
  uploadProgress,
  uploadStatus,
  visiblePhotoIndex
}: SheetCellPhotosPhotosProps) => {
  
  const activeSheetCellPhoto = sheetCellPhotos && sheetCellPhotos[visiblePhotoIndex]
  
  const uploadStatusMessages = {
    READY: 'Click here to upload a photo',
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

  const isArrowsVisible = sheetCellPhotos && sheetCellPhotos.length > 1
  const leftArrowPhotoIndexValue = sheetCellPhotos ? visiblePhotoIndex - 1 < 0 ? sheetCellPhotos.length - 1 : visiblePhotoIndex - 1 : 0
  const rightArrowPhotoIndexValue = sheetCellPhotos ? visiblePhotoIndex + 1 === sheetCellPhotos.length ? 0 : visiblePhotoIndex + 1 : 0

  return (
    <PhotosContainer>
      <LeftArrow 
        isVisible={isArrowsVisible}
        onClick={sheetCellPhotos ? () => setVisiblePhotoIndex(leftArrowPhotoIndexValue) : null}>
        <Icon 
          icon={ARROW_LEFT}/>
      </LeftArrow>
      <Photos>
        {sheetCellPhotos && activeSheetCellPhoto && 
          <SheetCellPhotosPhotosHeader
            activeSheetCellPhoto={activeSheetCellPhoto}
            beforePhotoDelete={() => setVisiblePhotoIndex(Math.max(0, visiblePhotoIndex - 1))}
            openPhotosInput={openPhotosInput}
            prepareUploadProgress={prepareUploadProgress}
            sheetCellPhotos={sheetCellPhotos}
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}/>
        }
        <PhotoContainer>
          {sheetCellPhotos && sheetCellPhotos.length > 0 && activeSheetCellPhoto
            ? <SheetCellPhotosPhotosPhoto
                sheetPhoto={activeSheetCellPhoto}/>
            : <NoPhotoMessage
                onClick={() => openPhotosInput()}>
                {uploadStatusMessages[uploadStatus]} {progressPercentage(uploadStatus)}
              </NoPhotoMessage>
        }
        </PhotoContainer>
      </Photos>
      <RightArrow 
        isVisible={isArrowsVisible}
        onClick={sheetCellPhotos ? () => setVisiblePhotoIndex(rightArrowPhotoIndexValue) : null}>
        <Icon 
          icon={ARROW_RIGHT}/>
      </RightArrow>
    </PhotosContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosPhotosProps {
  openPhotosInput(): void
  prepareUploadProgress: number
  setVisiblePhotoIndex(nextVisiblePhotoIndex: number): void
  sheetCellPhotos: ISheetPhoto[]
  uploadProgress: number
  uploadStatus: ISheetCellPhotosUploadStatus
  visiblePhotoIndex: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const PhotosContainer = styled.div`
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
  width: calc(35vw - 4rem);
  height: calc(60vh - 9rem);
`

const NoPhotoMessage = styled.div`
  margin-top: 1rem;
  cursor: pointer;
  width: calc(100% - 2rem);
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
export default SheetCellPhotosPhotos
