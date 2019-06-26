//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import * as React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const HiddenScrollbarContainer = ({ children, className }: HiddenScrollbarContainerProps) => (
	<Container className={className}>
    {children}
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type HiddenScrollbarContainerProps = {
  className?: string // Required by styled=components
  children: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
	overflow-y: scroll;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
`

export default HiddenScrollbarContainer