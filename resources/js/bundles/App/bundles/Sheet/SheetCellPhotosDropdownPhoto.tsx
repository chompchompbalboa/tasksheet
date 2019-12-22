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
  sheetPhoto
}: SheetCellPhotosPhotosPhotoProps) => {
  return (
    <Photo
      src={'https://' + environment.s3Bucket + '.s3.amazonaws.com/' + sheetPhoto.s3Key}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellPhotosPhotosPhotoProps {
  sheetPhoto: ISheetPhoto
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Photo = styled.img`
  max-width: 100%;
  max-height: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellPhotosPhotosPhoto
