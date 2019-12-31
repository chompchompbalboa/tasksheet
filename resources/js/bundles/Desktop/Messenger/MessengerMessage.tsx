//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { IMessengerMessageKey } from '@/state/messenger/types'
import { deleteMessengerMessage } from '@/state/messenger/actions'
import messages from '@/state/messenger/messages'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Messenger = ({
  message
}: IMessengerMessageProps) => {
  
  const dispatch = useDispatch()

  const [ messageOpacity, setMessageOpacity ] = useState('0')

  const messageTypes = {
    ERROR: {
      color: 'white',
      backgroundColor: 'rgb(210, 0, 0)'
    },
    SUCCESS: {
      color: 'white',
      backgroundColor: 'rgb(0, 120, 0)'
    }
  }

  const messageType = messageTypes[messages[message].type]

  useEffect(() => {
    setTimeout(() => {
      setMessageOpacity('1')
    }, 150)
    setTimeout(() => {
      dispatch(deleteMessengerMessage(message))
    }, 2250)
  })

  return (
    <Container
      messageBackgroundColor={messageType.backgroundColor}
      messageColor={messageType.color}
      messageOpacity={messageOpacity}>
      {messages[message].message}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IMessengerMessageProps {
  message: IMessengerMessageKey
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  opacity: ${ ({ messageOpacity }: IContainer ) => messageOpacity };
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  background-color: ${ ({ messageBackgroundColor }: IContainer ) => messageBackgroundColor };
  color: ${ ({ messageColor }: IContainer ) => messageColor };
  border-radius: 5px;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
  transition: opacity 0.5s;
`
interface IContainer {
  messageBackgroundColor: string
  messageColor: string
  messageOpacity: string
}

export default Messenger
