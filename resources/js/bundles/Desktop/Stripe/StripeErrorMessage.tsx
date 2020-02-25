//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeErrorMessage = ({
  errorCode
}: IStripeErrorMessage) => { 
  
  return (
    <Container>
      {stripeErrorMessages[errorCode] || errorCode && stripeErrorMessages['GENERIC_ERROR']}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripeErrorMessage {
  errorCode: IStripeErrorCode
}

export type IStripeErrorCode =
  'GENERIC_ERROR'

//-----------------------------------------------------------------------------
// Error Messages
//-----------------------------------------------------------------------------
export const stripeErrorMessages = {
  GENERIC_ERROR: 'There was a problem processing your payment. Please try again.'
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  color: rgb(150, 0, 0);
`

export default StripeErrorMessage
