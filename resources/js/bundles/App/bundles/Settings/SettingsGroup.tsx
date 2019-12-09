//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, ARROW_RIGHT }  from '@app/assets/icons'

import { IAppState } from '@app/state'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsGroup = ({
  children,
  header
}: ISettingsGroup) => {
  
  const [ isContentVisible, setIsContentVisible ] = useState(true)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container>
      <Header
        isContentVisible={isContentVisible}
        onClick={() => setIsContentVisible(!isContentVisible)}
        userColorPrimary={'rgb(225, 225, 225)' || userColorPrimary}>
        <Icon
          icon={isContentVisible ? ARROW_DOWN : ARROW_RIGHT}/>
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
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  background-color: rgb(245, 245, 245);
  border: 1px solid rgb(220, 220, 220);
  border-radius: 4px;
  margin-bottom: 0.5rem;
`

const Header = styled.div`
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  display: flex;
  align-items: center;
  background-color: ${ ({ userColorPrimary }: IHeader ) => userColorPrimary };
  color: black;
  font-size: 0.9rem;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: ${ ({ isContentVisible }: IHeader ) => isContentVisible ? '0' : '4px' };
  border-bottom-right-radius: ${ ({ isContentVisible }: IHeader ) => isContentVisible ? '0' : '4px' };
`
interface IHeader {
  isContentVisible: boolean
  userColorPrimary: string
}

const Content = styled.div`
  padding: 0.5rem;
  display: ${ ({ isContentVisible }: IContent ) => isContentVisible ? 'block' : 'none' };
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`
interface IContent {
  isContentVisible: boolean
}

export default SettingsGroup
