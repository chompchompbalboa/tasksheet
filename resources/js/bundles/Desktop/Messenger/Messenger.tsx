//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import MessengerMessage from '@desktop/Messenger/MessengerMessage'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Messenger = () => {

  const messages = useSelector((state: IAppState) => state.messenger.messages)

  return (
    <Container
      isVisible={messages.length > 0}>
      {messages.map((message, index) => (
        <MessengerMessage
          key={index}
          message={message}
          messageIndex={index}/>
      ))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: ${ ({ isVisible }: IContainer ) => isVisible ? 'flex' : 'none' };
  z-index: 100;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
interface IContainer {
  isVisible: boolean
}

export default Messenger
