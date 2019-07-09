//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import Settings from '@app/bundles/Settings/Settings'
import Sidebar from '@app/bundles/Sidebar/Sidebar'
import Tabs from '@app/bundles/Tabs/Tabs'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const App = () => (
	<Container>
		<Sidebar />
		<Settings />
		<Tabs />
	</Container>
)

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
	width: 100vw;
	min-height: 100vh;
`

export default App
