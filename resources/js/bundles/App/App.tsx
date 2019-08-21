//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectUserColorPrimary } from '@app/state/user/selectors'

import History from '@app/bundles/History/History'
import Modals from '@app/bundles/Modal/Modals'
import Settings from '@app/bundles/Settings/Settings'
import Tabs from '@app/bundles/Tabs/Tabs'
import User from '@app/bundles/User/User'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  appBackgroundColor: selectUserColorPrimary(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const App = ({
  appBackgroundColor
}: AppProps) => (
	<Container
    appBackgroundColor={appBackgroundColor}>
    <History />
    <Modals />
    <User />
		<Settings />
		<Tabs />
	</Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type AppProps = {
  appBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
	width: 100vw;
  min-height: 100vh;
  background-color: ${ ({ appBackgroundColor }: ContainerProps) => appBackgroundColor };
`
interface ContainerProps {
  appBackgroundColor: string
}

export default connect(
  mapStateToProps
)(App)
