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
  color = "black",
  fromId
}: LoadingTimerProps) => {
  
  const [ time, setTime ] = useState(0)
  
  useEffect(() => {
    setTime(0)
  }, [ fromId ])
  
  useInterval(() => {
    setTime(time => time + 10)
  }, 10)
  
  return (
    <Container
      data-testid="loadingTimerContainer"
      containerColor={color}>
      <Time>{(time / 1000).toFixed(2)} seconds</Time>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
interface LoadingTimerProps {
  color?: string
  fromId: string
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: -5vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${ ({ containerColor }: IContainer ) => containerColor };
  font-size: 1.2rem;
  opacity: 0.8;
`
interface IContainer {
  containerColor: string
}

const Time = styled.div``

export default LoadingTimer