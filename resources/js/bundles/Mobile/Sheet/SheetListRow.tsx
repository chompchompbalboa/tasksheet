//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo } from 'react'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { ISheet, ISheetRow } from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetListRow = memo(({
  sheetId,
  rowId,
  style
}: ISheetListRowProps) => {

  return (
    <Container
      style={style}>
      <ContentContainer>
        {sheetId} / {rowId}
      </ContentContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetListRowProps {
  sheetId: ISheet['id']
  rowId: ISheetRow['id']
  style: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
`

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background-color: white;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetListRow
