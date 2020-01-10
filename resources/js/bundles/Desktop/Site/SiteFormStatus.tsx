//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ISiteFormStatus = ({
  status,
  statusTextAlign = 'left'
}: IISiteFormStatus) => (
  <Container
    statusTextAlign={statusTextAlign}>
    {status}
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IISiteFormStatus {
  status: string
  statusTextAlign?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-top: 0.5rem;
  text-align: ${ ({ statusTextAlign }: IContainer ) => statusTextAlign };
`
interface IContainer {
  statusTextAlign: string
}

export default ISiteFormStatus
