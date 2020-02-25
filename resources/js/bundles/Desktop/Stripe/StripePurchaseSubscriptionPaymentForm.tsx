//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useMemo } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import styled from 'styled-components'

import { ITasksheetSubscriptionPlan } from '@/state/user/types'

import StripePurchaseSubscriptionPaymentFormElements from '@desktop/Stripe/StripePurchaseSubscriptionPaymentFormElements'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscriptionPaymentForm = ({
  activeSubscriptionPlan
}: IStripePurchaseSubscriptionPaymentForm) => {

  const stripe = useMemo(() => window.Stripe(environment.stripeKey), [])

  return (
    <Container>
      <Header>
        Please enter your card information: 
      </Header>
      <Elements
        stripe={stripe}>
        <StripePurchaseSubscriptionPaymentFormElements
          subscriptionPlan={activeSubscriptionPlan}/>
      </Elements>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripePurchaseSubscriptionPaymentForm {
  activeSubscriptionPlan: ITasksheetSubscriptionPlan
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
