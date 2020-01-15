//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsGroup = ({
  children,
  header,
  defaultIsContentVisible = true
}: ISettingsGroup) => {
  
  const [ isContentVisible, setIsContentVisible ] = useState(defaultIsContentVisible)

  return (
    <Container>
      <Header
        isContentVisible={isContentVisible}
        onClick={() => setIsContentVisible(!isContentVisible)}>
        &nbsp;&nbsp;{header}
      </Header>
      <Content
        isContentVisible={isContentVisible}>
        {children}
      </Content>
    </Container>
  )
}

export interface ISettingsGroup {
  children?: any
  header: string
  defaultIsContentVisible?: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  background-color: rgb(245, 245, 245);
  border-radius: 3px;
  margin-bottom: 0.75rem;
`

const Header = styled.div`
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  display: flex;
  align-items: center;
  background-color: rgb(225, 225, 225);
  color: rgb(10, 10, 10);
  font-size: 0.95rem;
  font-weight: bold;
  border: 1px solid rgb(175, 175, 175);
  border-bottom: ${ ({ isContentVisible }: IHeader ) => isContentVisible ? 'none' : '1px solid rgb(175, 175, 175)' };
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-left-radius: ${ ({ isContentVisible }: IHeader ) => isContentVisible ? '0' : '3px' };
  border-bottom-right-radius: ${ ({ isContentVisible }: IHeader ) => isContentVisible ? '0' : '3px' };
`
interface IHeader {
  isContentVisible: boolean
}

const Content = styled.div`
  padding: 0.5rem;
  display: ${ ({ isContentVisible }: IContent ) => isContentVisible ? 'block' : 'none' };
  border: 1px solid rgb(175, 175, 175);
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`
interface IContent {
  isContentVisible: boolean
}

export default SettingsGroup
