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
  statusTextAlign = 'left',
  testId = 'SiteFormStatus'
}: IISiteFormStatus) => (
  <Container
    data-testid={testId}
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
  testId?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-top: 0.5rem;
  text-align: ${ ({ statusTextAlign }: IContainer ) => statusTextAlign };
  color: rgb(175, 0, 0);
`
interface IContainer {
  statusTextAlign: string
}

export default ISiteFormStatus
