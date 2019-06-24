//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import * as React from 'react'
import styled from 'styled-components'

import Header from '@app/bundles/Header/Header'
import Sidebar from '@app/bundles/Sidebar/Sidebar'
import Sheets from '@app/bundles/Sheets/Sheets'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const App = () => (
	<Container>
		<Sidebar />
		<Header />
		<Sheets />
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
