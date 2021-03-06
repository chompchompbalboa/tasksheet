//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeForm = ({
  children,
  onSubmit
}: IStripeForm) => {
  return (
    <StyledForm 
      data-testid="StripeForm"
      onSubmit={onSubmit}>
      {children}
    </StyledForm>
  )
}

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
  min-width: 20rem;
`

export default StripeForm
