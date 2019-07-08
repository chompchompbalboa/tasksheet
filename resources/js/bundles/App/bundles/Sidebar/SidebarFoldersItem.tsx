//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SidebarFoldersItem = ({
  icon,
  onClick,
  text
}: SidebarFoldersItemProps) => {
  return (
    <Container
      onClick={onClick}>
      <IconContainer>
        <Icon
          icon={icon}
          size="0.9rem"/>
      </IconContainer>
      <Name>
        {text}
      </Name>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarFoldersItemProps = {
  icon: string
  text: string
  onClick?(): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;
  padding: 0.125rem 0.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  color: white;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    text-decoration: underline;
  }
`

const IconContainer = styled.div``

const Name = styled.div`
  margin-left: 0.5rem;
`

export default SidebarFoldersItem
