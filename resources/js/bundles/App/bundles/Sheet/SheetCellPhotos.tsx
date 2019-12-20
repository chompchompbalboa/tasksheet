//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT, PHOTOS } from '@app/assets/icons'

import { mutation } from '@app/api'
import { storeFileToS3 } from '@/api/vapor'

import { IAppState } from '@app/state'
import { ISheetCell, ISheetPhoto } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotos = ({
  sheetId,
  cellId,
  cell,
  updateCellValue,
  ...passThroughProps
}: SheetCellPhotosProps) => {

  // Refs
  const container = useRef(null)
  const uploadInput = useRef(null)
  
  // Redux
  const sheetCellPhotos = useSelector((state: IAppState) => state.sheet.allSheetCellPhotos && state.sheet.allSheetCellPhotos[cellId] && state.sheet.allSheetCellPhotos[cellId].map((sheetPhotoId: ISheetPhoto['id']) => {
    return state.sheet.allSheetPhotos[sheetPhotoId]
  }))

  // State
  const [ isPhotosVisible, setIsPhotosVisible ] = useState(false)
  const [ uploadStatus, setUploadStatus ] = useState('READY' as TUploadStatus)
  const [ visiblePhotoIndex, setVisiblePhotoIndex ] = useState(0)

  useEffect(() => {
    if(isPhotosVisible) { 
      addEventListener('click', closeOnClickOutside)
    }
    else { removeEventListener('click', closeOnClickOutside) }
    return () => removeEventListener('click', closeOnClickOutside)
  }, [ isPhotosVisible ])
  
  useEffect(() => {
    return () => {
      setIsPhotosVisible(false)
    }
  }, [])

  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsPhotosVisible(false)
    }
  }

  const handleContainerClick = () => {
    setIsPhotosVisible(true)
  }
  
  const handleUploadPhotosButtonClick = () => {
    uploadInput.current.click()
  }
  
  const handleUploadInputSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const photosList = e.target.files
    const photosIndexes = Object.keys(photosList)
    const photosToUpload = photosIndexes.map((index: any) => photosList[index])
    if(photosIndexes.length > 0) {
      const file = photosToUpload[0]
      setUploadStatus('UPLOADING')
      storeFileToS3(file).then(s3PresignedUrlData => {
        setUploadStatus('SAVING_SHEET_CELL_PHOTO')
        mutation.createSheetCellPhoto(sheetId, cellId, file.name, s3PresignedUrlData).then(nextSheetCellPhotos => {
          setUploadStatus('UPLOADED')
          updateCellValue(nextSheetCellPhotos.length + '')
          setTimeout(() => setUploadStatus('READY'), 1000)
        })
      })
    }
  }
  
  const uploadStatusMessages = {
    READY: 'Add photos',
    SAVING_SHEET_CELL_PHOTO: 'Saving File Data...',
    UPLOADING: 'Uploading...',
    UPLOADED: 'Uploaded!'
  }

  return (
    <SheetCellContainer
      testId="SheetCellPhotos"
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
            icon={PHOTOS}
            size="18px"/>
          <PhotoCount>
            ({ cell.value || 0 })
          </PhotoCount>
        </IconContainer>
        {isPhotosVisible &&
          <PhotosContainer>
            <LeftArrow 
              onClick={sheetCellPhotos ? () => setVisiblePhotoIndex(visiblePhotoIndex - 1 < 0 ? sheetCellPhotos.length - 1 : visiblePhotoIndex - 1) : () => null}>
              <Icon 
                icon={ARROW_LEFT}/>
            </LeftArrow>
            <Photos>
              {sheetCellPhotos &&
                <PhotoHeader>
                  <PhotoLabel>
                    {sheetCellPhotos && sheetCellPhotos.length > 0 && sheetCellPhotos[visiblePhotoIndex]
                      ? sheetCellPhotos[visiblePhotoIndex].uploadedBy + ' on ' + sheetCellPhotos[visiblePhotoIndex].uploadedAt
                      : ''
                    }
                  </PhotoLabel>
                  <UploadPhotoButton
                    onClick={() => handleUploadPhotosButtonClick()}>
                    {uploadStatusMessages[uploadStatus]}
                  </UploadPhotoButton>
                </PhotoHeader>
              }
              <PhotoContainer>
                {sheetCellPhotos && sheetCellPhotos.length > 0 
                  ? sheetCellPhotos.map((photo, index) => (
                      <Photo
                        key={index}
                        isVisible={index === visiblePhotoIndex}
                        src={'https://' + environment.s3Bucket + '.s3.amazonaws.com/' + photo.s3Key}/>
                    ))
                  : <NoPhotoMessage
                      onClick={() => handleUploadPhotosButtonClick()}>
                      Click here to upload photos
                    </NoPhotoMessage>
              }
              </PhotoContainer>
            </Photos>
            <RightArrow 
              onClick={sheetCellPhotos ? () => setVisiblePhotoIndex(visiblePhotoIndex + 1 === sheetCellPhotos.length ? 0 : visiblePhotoIndex + 1) : () => null}>
              <Icon 
                icon={ARROW_RIGHT}/>
            </RightArrow>
          </PhotosContainer>
        }
      </Container>
      <UploadInput
        ref={uploadInput}
        type="file"
        accept="image/*"
        multiple
        onChange={e => handleUploadInputSelect(e)}/>
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
  updateCellValue(nextCellValue: string): void
  value: string
}
type TUploadStatus = 'READY' | 'SAVING_SHEET_CELL_PHOTO' | 'UPLOADING' | 'UPLOADED'

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

const PhotoCount = styled.div`
  font-weight: bold;
`

const PhotosContainer = styled.div`
  position: absolute;
  top: calc(100% + 2.5px);
  left: -4px;
  width: 35vw;
  height: 60vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(245, 245, 245);
  color: black;
  border-radius: 5px;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`

const Arrow = styled.div`
  cursor: pointer;
  width: 3rem;
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
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const RightArrow = styled(Arrow)`
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`

const Photos = styled.div`
  width: calc(100% - 6rem);
  height: calc(100% - 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PhotoHeader = styled.div`
  width: 100%;
  padding: 1rem 1rem 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PhotoLabel = styled.div`
`
const UploadPhotoButton = styled.div`
  cursor: pointer;
  padding: 0.25rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.375);
  border-radius: 5px;
  transition: background-color 0.15s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const PhotoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`

const Photo = styled.img`
  display: ${ ({ isVisible }: IStyledImg ) => isVisible ? 'block' : 'none' };
  max-width:100%; 
  max-height:100%;
  margin: auto;
`
interface IStyledImg {
  isVisible: boolean
}

const NoPhotoMessage = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const UploadInput = styled.input`
  display: none;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotos
