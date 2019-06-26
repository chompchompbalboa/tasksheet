//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import * as React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ResizeContainer = ({ children, className }: ResizeContainerProps) => (
	<Container className={className}>
    {children}
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type ResizeContainerProps = {
  className?: string // Required by styled=components
  children: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

export default ResizeContainer