//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import { IMessengerMessage } from '@/state/messenger/types'
import { deleteMessengerMessage } from '@/state/messenger/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Messenger = ({
  message,
  messageIndex
}: IMessengerMessageProps) => {

  // Refs
  const deleteMessageTimeout = useRef(0)
  const setMessageOpacityTimeout = useRef(0)

  // Redux
  const dispatch = useDispatch()

  // State
  const [ messageOpacity, setMessageOpacity ] = useState('0')

  // Effects
  useEffect(() => {
    setMessageOpacityTimeout.current = setTimeout(() => {
      setMessageOpacity('1')
    }, 150)
    deleteMessageTimeout.current = setTimeout(() => {
      dispatch(deleteMessengerMessage(messageIndex))
    }, message.timeout || 5000)
    return () => {
      clearTimeout(deleteMessageTimeout.current)
      clearTimeout(setMessageOpacityTimeout.current)
    }
  }, [ deleteMessageTimeout, message, setMessageOpacityTimeout ])

  // Message Types
  const messageTypes = {
    ERROR: {
      color: 'white',
      backgroundColor: 'rgb(210, 0, 0)'
    },
    MESSAGE: {
      color: 'white',
      backgroundColor: 'rgb(0, 120, 0)'
    }
  }

  const messageType = messageTypes[message.type]

  return (
    <Container
      messageBackgroundColor={messageType.backgroundColor}
      messageColor={messageType.color}
      messageOpacity={messageOpacity}>
      <Message>
        {message.message}
      </Message>
      <DeleteButton
        data-testid="MessengerMessageDeleteButton"
        onClick={() => dispatch(deleteMessengerMessage(messageIndex))}>
        <Icon
          icon={CLOSE}/>
      </DeleteButton>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IMessengerMessageProps {
  message: IMessengerMessage
  messageIndex: number
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
  pointer-events: auto;
`
interface IContainer {
  messageBackgroundColor: string
  messageColor: string
  messageOpacity: string
}

const Message = styled.div``

const DeleteButton = styled.div`
  cursor: pointer;
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default Messenger
