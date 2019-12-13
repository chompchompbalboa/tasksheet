//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { CardElement } from 'react-stripe-elements'

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
    <CardElement {...cardElementOptions}/>
  )
}
  
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default StripeCardInput
