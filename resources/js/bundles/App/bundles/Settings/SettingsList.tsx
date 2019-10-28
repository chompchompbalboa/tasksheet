//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsList = ({
  children,
  name = 'List',
  width = '100%'
}: ISettingsList) => {

  return (
    <Container
      containerWidth={width}>
      <Name>{name}</Name>
      <List>{children}</List>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsList {
  children?: any
  name?: string
  width: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
`
interface IContainer {
  containerWidth: string
}

const Name = styled.h3`
  padding: 0.25rem 0.125rem;
`

const List = styled.div``

export default SettingsList
