//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import useInterval from '@/utils/useInterval'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const LoadingTimer = ({
  fromId
}: LoadingTimerProps) => {
  
  const [ time, setTime ] = useState(0)
  
  useEffect(() => {
    setTime(0)
  }, [ fromId ])
  
  useInterval(() => {
    setTime(time => time + 5)
  }, 5)
  
  return (
    <Container>
      <Time>{(time / 1000).toFixed(3)} seconds</Time>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
interface LoadingTimerProps {
  fromId: string
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

export default LoadingTimer