//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeErrorMessage = ({
  error
}: IStripeErrorMessage) => { 
  return (
    <Container>
      {error && error.code && (
        stripeErrorCodeWhitelist.includes(error.code)
        ? error.message
        : stripeGenericErrorMessage
      )}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripeErrorMessage {
  error: IStripeError
}

export interface IStripeError {
  code: string
  message: string
}

//-----------------------------------------------------------------------------
// Error Messages
//-----------------------------------------------------------------------------
export const stripeErrorCodeWhitelist = [
  'card_declined',
  'expired_card',
  'generic_error',
  'incomplete_cvc',
  'incomplete_expiry',
  'incomplete_number', 
  'incorrect_cvc'
]

export const stripeGenericErrorMessage = 'There was a problem processing your payment. Please try again.'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  color: rgb(150, 0, 0);
`

export default StripeErrorMessage
