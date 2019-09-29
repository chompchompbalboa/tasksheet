//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import History from '@app/bundles/History/History'
import Modals from '@app/bundles/Modal/Modals'
import Tabs from '@app/bundles/Tabs/Tabs'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const App = () => {

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container
      containerBackgroundColor={userColorPrimary}>
      <History />
      <Modals />
      <Tabs />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
	width: 100vw;
  min-height: 100vh;
  background-color: ${ ({ containerBackgroundColor }: ContainerProps) => containerBackgroundColor };
`
interface ContainerProps {
  containerBackgroundColor: string
}

export default App
