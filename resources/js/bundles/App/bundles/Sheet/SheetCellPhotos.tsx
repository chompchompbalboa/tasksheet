//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'


import { mutation } from '@app/api'
import { storeFileToS3 } from '@/api/vapor'

import { IAppState } from '@app/state'
import { ISheetCell, ISheetPhoto } from '@app/state/sheet/types'
import { createSheetCellPhoto } from '@app/state/sheet/actions'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'
import SheetCellPhotosPhotos from '@app/bundles/Sheet/SheetCellPhotosPhotos'
import SheetCellPhotosValue from '@app/bundles/Sheet/SheetCellPhotosValue'

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
  const dispatch = useDispatch()
  const sheetCellPhotos = useSelector((state: IAppState) => state.sheet.allSheetCellPhotos && state.sheet.allSheetCellPhotos[cellId] && state.sheet.allSheetCellPhotos[cellId].map((sheetPhotoId: ISheetPhoto['id']) => {
    return state.sheet.allSheetPhotos[sheetPhotoId]
  }))

  // State
  const [ isPhotosVisible, setIsPhotosVisible ] = useState(false)
  const [ prepareUploadProgress, setPrepareUploadProgress ] = useState(0)
  const [ uploadProgress, setUploadProgress ] = useState(0)
  const [ uploadStatus, setUploadStatus ] = useState('READY' as ISheetCellPhotosUploadStatus)
  const [ visiblePhotoIndex, setVisiblePhotoIndex ] = useState(0)

  // Effects
  useEffect(() => {
    if(isPhotosVisible) { addEventListener('click', closeOnClickOutside) }
    else { removeEventListener('click', closeOnClickOutside) }
    return () => removeEventListener('click', closeOnClickOutside)
  }, [ isPhotosVisible ])
  
  useEffect(() => {
    return () => { setIsPhotosVisible(false) }
  }, [])

  // Close the photos container on click outside
  const closeOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      setIsPhotosVisible(false)
    }
  }

  // Open the photos container when the cell is clicked on
  const handleContainerClick = () => {
    setIsPhotosVisible(true)
  }
  
  // Open the file dialog to upload a photo
  const openPhotosInput = () => {
    uploadInput.current.click()
  }
  
  // Upload a photo
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const photosList = e.target.files
    const photosIndexes = Object.keys(photosList)
    const photosToUpload = photosIndexes.map((index: any) => photosList[index])
    if(photosIndexes.length > 0) {
      const file = photosToUpload[0]
      setUploadStatus('PREPARING_UPLOAD')
      storeFileToS3(file, () => setUploadStatus('UPLOADING'), setPrepareUploadProgress, setUploadProgress).then(s3PresignedUrlData => {
        setUploadStatus('SAVING_SHEET_CELL_PHOTO')
        mutation.createSheetCellPhoto(sheetId, cellId, file.name, s3PresignedUrlData).then(nextSheetCellPhotos => {
          setUploadStatus('UPLOADED')
          setPrepareUploadProgress(0)
          setUploadProgress(0)
          dispatch(createSheetCellPhoto(cellId, nextSheetCellPhotos[nextSheetCellPhotos.length - 1]))
          updateCellValue(nextSheetCellPhotos.length + '')
          setTimeout(() => setUploadStatus('READY'), 1000)
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
      onlyRenderChildren
      updateCellValue={() => null}
      value={null}
      {...passThroughProps}>
      <Container
        ref={container}
        onClick={() => handleContainerClick()}>
        <SheetCellPhotosValue
          value={cell.value}/>
        {isPhotosVisible &&
          <SheetCellPhotosPhotos
            openPhotosInput={openPhotosInput}
            prepareUploadProgress={prepareUploadProgress}
            setVisiblePhotoIndex={setVisiblePhotoIndex}
            sheetCellPhotos={sheetCellPhotos}
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}
            visiblePhotoIndex={visiblePhotoIndex}/>
        }
      </Container>
      <UploadInput
        ref={uploadInput}
        type="file"
        accept="image/*"
        multiple
        onChange={e => handlePhotoUpload(e)}/>
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
export type ISheetCellPhotosUploadStatus = 'READY' | 'PREPARING_UPLOAD' | 'UPLOADING' | 'SAVING_SHEET_CELL_PHOTO' | 'UPLOADED'

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
