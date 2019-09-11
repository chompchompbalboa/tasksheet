//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ITALIC } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleItalic = ({
  sheetId
}: SheetActionCellStyleItalicProps) => {
  
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)

  return (
    <Container
      containerBackgroundColor={userColorPrimary}>
      <Icon 
        icon={ITALIC}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleItalicProps {
  sheetId: Sheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;  
  margin-left: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleItalic
