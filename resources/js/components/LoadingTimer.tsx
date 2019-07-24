//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import useInterval from '@/utils/useInterval'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const LoadingTimer = () => {
  
  const [ time, setTime ] = useState(0)
  
  useInterval(() => {
    setTime(time => time + 5)
  }, 5)
  
  return (
    <Container>
      <Time>{(time / 1000).toFixed(3)} seconds</Time>
      <Message>Thank you for your patience.</Message>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
`

const Time = styled.div``

const Message = styled.div``

export default LoadingTimer