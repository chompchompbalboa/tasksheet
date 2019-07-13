//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { SETTINGS_BACKGROUND_COLOR } from '@app/assets/colors'
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
  right: 0.25rem;
  height: 1.75rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${ ({ isVisible }: SettingsLinkProps) => isVisible ? 'rgb(40, 40, 40)' : 'rgb(255, 255, 255)'};
  transform: ${ ({ isVisible }: SettingsLinkProps) => isVisible ? 'none' : 'scale(-1, 1)'};
  transition: transform 0.25s;
`
type SettingsLinkProps = {
  isVisible: boolean
}

const SettingsContainer = styled.div`
  z-index: 2;
  position: fixed;
  background-color: ${ SETTINGS_BACKGROUND_COLOR };
  opacity: ${ ({ isVisible }: SettingsContainerProps) => isVisible ? '1' : '0'};
  top: 0;
  left: ${ ({ isVisible }: SettingsContainerProps) => isVisible ? '75vw' : '100vw'};
  height: 100vh;
  width: 25vw;
  padding: 1rem;
  transition: all 0.25s;
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);

`
type SettingsContainerProps = {
  isVisible: boolean
}

const SettingsHeader = styled.h2`
  margin-left: 0.25rem;
  margin-bottom: 1rem;
`

export default Settings
