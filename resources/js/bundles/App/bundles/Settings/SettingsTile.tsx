//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsTile = ({
  children,
  header
}: SettingsTileProps) => {

  const [ isItemsVisible, setIsItemsVisible ] = useState(true)

  return (
    <Container>
      <Header
        data-testid="settingsTileHeader" 
        onClick={() => setIsItemsVisible(!isItemsVisible)}>
        {header}
      </Header>
      <Items 
        data-testid="settingsTileItems"
        isItemsVisible={isItemsVisible}>
        {children}
      </Items>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SettingsTileProps = {
  children?: any
  header: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

const Header = styled.h3`
  margin-left: 0.25rem;
  cursor: pointer;
  width: 100%;
  &:hover {
    text-decoration: underline;
  }
`

const Items = styled.div`
  display: ${ ({ isItemsVisible }: ItemsProps) => isItemsVisible ? 'block' : 'none'};
`
type ItemsProps = {
  isItemsVisible: boolean
}

export default SettingsTile
