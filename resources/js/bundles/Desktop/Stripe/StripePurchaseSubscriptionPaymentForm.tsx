//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useMemo } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import {loadStripe } from '@stripe/stripe-js'
import styled from 'styled-components'

import StripePurchaseSubscriptionPaymentFormElements from '@desktop/Stripe/StripePurchaseSubscriptionPaymentFormElements'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscriptionPaymentForm = ({
  monthlyOrLifetime
}: IStripePurchaseSubscriptionPaymentForm) => {

  const stripe = useMemo(() => loadStripe(environment.stripeKey), [])

  return (
    <Container>
      <Header>
        Please enter your card information: 
      </Header>
      <Elements
        stripe={stripe}>
        <StripePurchaseSubscriptionPaymentFormElements
          monthlyOrLifetimeSubscription={monthlyOrLifetime}/>
      </Elements>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripePurchaseSubscriptionPaymentForm {
  monthlyOrLifetime: 'MONTHLY' | 'LIFETIME'
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 1rem;
`

const Header = styled.div`
  margin-bottom: 0.5rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default StripePurchaseSubscriptionPaymentForm
