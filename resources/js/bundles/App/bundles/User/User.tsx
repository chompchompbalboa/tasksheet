//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { USER } from '@app/assets/icons'

import Icon from '@/components/Icon'
import UserLogout from '@app/bundles/User/UserLogout'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const User = ({
}: SheetProps) => {

  const container = useRef(null)
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
    if(!container.current.contains(e.target)) {
      setIsVisible(false)
    }
  }

  return (
    <>
      <UserLink
        isVisible={isVisible}
        onClick={() => setIsVisible(!isVisible)}>
        <Icon
          icon={USER}
          size="1rem"/>
      </UserLink>
      <UserContainer
        ref={container}
        isVisible={isVisible}>
        <UserLogout />
      </UserContainer>
    </>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetProps {
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const UserLink = styled.div`
  z-index: 3;
  position: fixed;
  top: 0;
  right: 1.75rem;
  height: 1.75rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${ ({ isVisible }: UserLinkProps) => isVisible ? 'rgb(255, 255, 255)' : 'rgb(225, 225, 225)'};
  &:hover {
    color: white;
  }
`
type UserLinkProps = {
  isVisible: boolean
}

const UserContainer = styled.div`
  z-index: 3;
  display: ${ ({ isVisible }: UserContainerProps) => isVisible ? 'flex' : 'none'};
  flex-direction: column;
  position: fixed;
  top: 1.75rem;
  right: 1.75rem;
  background-color: rgb(250, 250, 250);
  min-width: 10rem;
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
  border-radius: 5px;
`
type UserContainerProps = {
  isVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default User
