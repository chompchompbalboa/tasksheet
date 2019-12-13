//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { injectStripe } from 'react-stripe-elements'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeForm = ({
  children,
  onSubmit
}: IStripeForm) => (
  <StyledForm onSubmit={onSubmit}>
    {children}
  </StyledForm>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripeForm {
  children: any
  onSubmit(...args: any): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledForm = styled.form`
  min-width: 25rem;
`

export default injectStripe(StripeForm)
