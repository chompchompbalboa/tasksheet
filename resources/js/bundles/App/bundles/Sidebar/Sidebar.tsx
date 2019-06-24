//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import * as React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Sidebar = () => <Container>Sidebar</Container>

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 15vw;
	height: 100vh;
	overflow-y: scroll;
	background-color: red;
`

export default Sidebar
