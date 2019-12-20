//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ISheetPhoto } from '@app/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellPhotosPhotosPhoto = ({
  isVisible,
  sheetPhoto
}: SheetCellPhotosPhotosPhotoProps) => {
  return (
    <Photo
      isVisible={isVisible}
      src={'https://' + environment.s3Bucket + '.s3.amazonaws.com/' + sheetPhoto.s3Key}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosPhotosPhotoProps {
  isVisible: boolean
  sheetPhoto: ISheetPhoto
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Photo = styled.img`
  display: ${ ({ isVisible }: IPhoto ) => isVisible ? 'block' : 'none' };
  max-width:100%; 
  max-height:100%;
  margin: auto;
`
interface IPhoto {
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotosPhotosPhoto
