//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT, PHOTOS } from '@app/assets/icons'

import { SheetCell, SheetColumnType } from '@app/state/sheet/types'

import Icon from '@/components/Icon'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

const photos = [
  {
    url: 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/LakeWakatipuNewZealand.jpg?crop=0,30,4928,2710&wid=4000&hei=2200&scl=1.232',
    uploadedBy: 'George Washington',
    uploadedDate: '08/10/2019'
  },
  {
    url: 'https://www.newzealand.com/assets/Videos/794d90bf26/img-1536194798-4751-15338-34BFCBA3-C25A-17FB-A15D11670B2F607E__FocalPointCropWzQyNyw2NDAsNTAsNTAsODUsImpwZyIsNjUsMi41XQ.jpg',
    uploadedBy: 'Abraham Lincoln',
    uploadedDate: '08/11/2019'
  },
  {
    url:'https://techcrunch.com/wp-content/uploads/2018/08/GettyImages-939027862.jpg?w=730&crop=1',
    uploadedBy: 'Dwight Eisenhower',
    uploadedDate: '08/12/2019'
  },
  {
    url: 'https://pbs.twimg.com/media/DW6KCAcVMAA5Hne.jpg',
    uploadedBy: 'Franklin D. Roosevelt',
    uploadedDate: '08/13/2019'
  },
  {
    url: 'https://cdn.cnn.com/cnnnext/dam/assets/170606121305-new-zealand---travel-destination---shutterstock-180140354.jpg',
    uploadedBy: 'Bill Clinton',
    uploadedDate: '08/14/2019'
  },
  {
    url: 'https://www.trafalgar.com/~/media/images/home/destinations/south-pacific/new-zealand/2016-licensed-images/newzealand-milfordsound-hero-l-515663650.jpg?mw=1200&',
    uploadedBy: 'Barack Obama',
    uploadedDate: '08/15/2019'
  },
  {
    url: 'https://www.nzherald.co.nz/resizer/nd6c_OkU6Z3mTXajhjciCH5U8Os=/360x384/filters:quality(70)/arc-anglerfish-syd-prod-nzme.s3.amazonaws.com/public/PE3NR7BS4RDIZHW7V3YGCOVWYI.jpg',
    uploadedBy: 'Jimmy Carter',
    uploadedDate: '08/16/2019'
  },
]
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotos = ({
  cellId,
  ...passThroughProps
}: SheetCellPhotosProps) => {

  // Refs
  const container = useRef(null)

  // State
  const [ isPhotosVisible, setIsPhotosVisible ] = useState(false)
  const [ visiblePhotoIndex, setVisiblePhotoIndex ] = useState(0)

  useEffect(() => {
    if(isPhotosVisible) { addEventListener('click', closeOnClickOutside) }
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

  return (
    <SheetCellContainer
      cellId={cellId}
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
                  {photos[visiblePhotoIndex].uploadedBy} on {photos[visiblePhotoIndex].uploadedDate}
                </PhotoLabel>
                <UploadPhotoButton>
                  Add photos
                </UploadPhotoButton>
              </PhotoHeader>
              <PhotoContainer>
                {photos.map((photo, index) => (
                  <Photo
                    key={index}
                    isVisible={index === visiblePhotoIndex}
                    src={photo.url}/>
                ))}
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
  justify-content: center;
  align-items: center;
  color: rgb(100, 100, 100);
  &:hover {
    color: rgb(60, 60, 60);
  }
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

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotos
