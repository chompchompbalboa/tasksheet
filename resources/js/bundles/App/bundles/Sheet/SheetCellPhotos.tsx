//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT, PHOTOS } from '@app/assets/icons'

import { mutation, query } from '@app/api'

import { SheetCell, SheetColumnType } from '@app/state/sheet/types'

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

  // State
  const [ hasPhotosLoaded, setHasPhotosLoaded ] = useState(false)
  const [ photos, setPhotos ] = useState([])
  const [ isPhotosVisible, setIsPhotosVisible ] = useState(false)
  const [ uploadStatus, setUploadStatus ] = useState('READY' as TUploadStatus)
  const [ visiblePhotoIndex, setVisiblePhotoIndex ] = useState(0)

  useEffect(() => {
    if(isPhotosVisible) { 
      addEventListener('click', closeOnClickOutside)
      if(!hasPhotosLoaded) {
        query.getSheetCellPhotos(cellId).then(photosFromServer => {
          setHasPhotosLoaded(true)
          setPhotos(photosFromServer)
        })
      }
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
    const previousPhotosLength = photos.length || 0
    if(photosIndexes.length > 0) {
      setUploadStatus('UPLOADING')
      const photosToUpload = photosIndexes.map((index: any) => photosList[index])
      mutation.createSheetCellPhotos(sheetId, cellId, photosToUpload).then(nextSheetCellPhotos => {
        setPhotos(nextSheetCellPhotos)
        setUploadStatus('UPLOADED')
        setVisiblePhotoIndex(previousPhotosLength)
        updateCellValue(nextSheetCellPhotos.length)
        setTimeout(() => setUploadStatus('READY'), 1000)
      })
    }
  }
  
  const uploadStatusMessages = {
    READY: 'Add photos',
    UPLOADING: 'Uploading...',
    UPLOADED: 'Uploaded!'
  }

  return (
    <SheetCellContainer
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
              onClick={() => setVisiblePhotoIndex(visiblePhotoIndex - 1 < 0 ? photos.length - 1 : visiblePhotoIndex - 1)}>
              <Icon 
                icon={ARROW_LEFT}/>
            </LeftArrow>
            <Photos>
              <PhotoHeader>
                <PhotoLabel>
                  {hasPhotosLoaded && photos.length > 0 && photos[visiblePhotoIndex]
                    ? photos[visiblePhotoIndex].uploadedBy + ' on ' + photos[visiblePhotoIndex].uploadedDate
                    : ''
                  }
                </PhotoLabel>
                <UploadPhotoButton
                  onClick={() => handleUploadPhotosButtonClick()}>
                  {uploadStatusMessages[uploadStatus]}
                </UploadPhotoButton>
              </PhotoHeader>
              <PhotoContainer>
                {hasPhotosLoaded && photos.length > 0 
                  ? photos.map((photo, index) => (
                      <Photo
                        key={index}
                        isVisible={index === visiblePhotoIndex}
                        src={'/storage/photos/' + photo.filename}/>
                    ))
                  : <NoPhotoMessage
                      hasPhotosLoaded={hasPhotosLoaded}>
                    </NoPhotoMessage>
              }
              </PhotoContainer>
            </Photos>
            <RightArrow 
              onClick={() => setVisiblePhotoIndex(visiblePhotoIndex + 1 === photos.length ? 0 : visiblePhotoIndex + 1)}>
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
  cell: SheetCell
  cellId: string
  columnType: SheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

type TUploadStatus = 'READY' | 'UPLOADING' | 'UPLOADED'

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
  background-color: black;
  color: white;
  width: 50vw;
  height: 75vh;
  border-radius: 10px;
  border-top-left-radius: 0;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Arrow = styled.div`
  cursor: pointer;
  width: 6%;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`
const LeftArrow = styled(Arrow)`
  border-bottom-left-radius: 10px;
`

const RightArrow = styled(Arrow)`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`

const Photos = styled.div`
  width: 88%;
  height: 100%;
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: ${ ({ hasPhotosLoaded }: INoPhotoMessage ) => hasPhotosLoaded ? '1' : '0' };
  transition: opacity 0.5s;
`
interface INoPhotoMessage {
  hasPhotosLoaded: boolean
}

const UploadInput = styled.input`
  display: none;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotos
