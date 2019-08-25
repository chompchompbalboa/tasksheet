//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { SETTINGS } from '@app/assets/icons'

import Icon from '@/components/Icon'
import SettingsUserColor from './SettingsUserColor'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Settings = () => {

  const settingsContainer = useRef(null)
  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {
    if(isVisible) {
      window.addEventListener('click', handleClick)
    }
    else {
      window.removeEventListener('click', handleClick)
    }
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [ isVisible ])

  const handleClick = (e: Event) => {
    if(!settingsContainer.current.contains(e.target)) {
      setIsVisible(false)
    }
  }

  return (
    <>
      <SettingsLink
        data-testid="settingsLink"
        isVisible={isVisible}
        onClick={() => setIsVisible(!isVisible)}>
        <Icon
          icon={SETTINGS} 
          size="1rem" />
      </SettingsLink>
      <SettingsContainer
        data-testid="settingsContainer"
        ref={settingsContainer}
        isVisible={isVisible}>
        <SettingsHeader>Settings</SettingsHeader>
        <SettingsUserColor />
      </SettingsContainer>
    </>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const SettingsLink = styled.div`
  z-index: 3;
  position: fixed;
  top: 0;
  right: 0.375rem;
  height: 1.75rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${ ({ isVisible }: SettingsLinkProps) => isVisible ? 'rgb(255, 255, 255)' : 'rgb(225, 225, 225)'};
  &:hover {
    color: white;
  }
`
type SettingsLinkProps = {
  isVisible: boolean
}

const SettingsContainer = styled.div`
  z-index: 3;
  display: ${ ({ isVisible }: SettingsContainerProps) => isVisible ? 'flex' : 'none'};
  flex-direction: column;
  position: fixed;
  top: 1.75rem;
  right: 0.375rem;
  padding: 0.75rem;
  background-color: rgb(250, 250, 250);
  padding: 1rem;
  min-width: 16rem;
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
  border-radius: 5px;
`
type SettingsContainerProps = {
  isVisible: boolean
}

const SettingsHeader = styled.h2`
  margin-left: 0.25rem;
  margin-bottom: 1rem;
`

export default Settings
