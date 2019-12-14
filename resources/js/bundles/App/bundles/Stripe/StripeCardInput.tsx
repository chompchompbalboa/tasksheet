//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { CardCvcElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripeCardInput = () => { 

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        backgroundColor: 'white',
        '::placeholder': {
          color: '#aab7c4',
        }
      },
      invalid: {
        color: '#c23d4b',
      }
    }
  }
  
  return (
    <Container>
      <CardNumberContainer>
        <CardDetailContainer
          width="100%">
          <label>Number:</label>
          <CardNumberElement {...cardElementOptions}/>
        </CardDetailContainer>
      </CardNumberContainer>
      <CardDetailsContainer>
        <CardDetailContainer
          width="20%">
          <label>CVC:</label>
          <CardCvcElement {...cardElementOptions}/>
        </CardDetailContainer>
        &nbsp;&nbsp;
        <CardDetailContainer
          width="40%">
          <label>Expiration:</label>
          <CardExpiryElement {...cardElementOptions}/>
        </CardDetailContainer>
      </CardDetailsContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const CardNumberContainer = styled.div`
  
`

const CardDetailsContainer = styled.div`
  display: flex;
`

const CardDetailContainer = styled.div`
  display: inline;
  width: ${ ({ width }: ICardDetailContainer) => 'calc(' + width + ' - 0.5rem)' };
`
interface ICardDetailContainer {
  width: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default StripeCardInput
