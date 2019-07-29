//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { SAVE } from '@app/assets/icons' 

import { FileType } from '@app/state/folder/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSaveView = ({
  sheetId,
  openSaveMenu
}: SheetActionSaveViewProps) => {

  const handleClick = () => {
    openSaveMenu('SHEET_VIEW', sheetId)
  }

  return (
    <Container
      onClick={() => handleClick()}>
      <Icon
        icon={SAVE}
        size="1.2rem"/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionSaveViewProps {
  sheetId: string
  openSaveMenu(fileType: FileType, id: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  padding: 0.3rem;
  transition: all 0.05s;
  &:hover {
    background-color: rgb(0, 120, 0);
    color: rgb(240, 240, 240);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSaveView
