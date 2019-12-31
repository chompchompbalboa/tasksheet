//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IFile } from '@/state/folder/types'
import { ISheet } from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetMobile = memo(({
  fileId,
  id: sheetId,
}: ISheetProps) => {
  false && console.log(fileId, sheetId)
  return (
    <Container
      data-testid="SheetMobileContainer">
      SheetMobile
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetProps {
  fileId: IFile['id']
  id: ISheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetMobile
