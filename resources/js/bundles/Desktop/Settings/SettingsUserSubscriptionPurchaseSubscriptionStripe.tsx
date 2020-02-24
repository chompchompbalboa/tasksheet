//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import styled from 'styled-components'

import StripePurchaseSubscription from '@desktop/Stripe/StripePurchaseSubscription'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionPurchaseSubscriptionStripe = ({
  monthlyOrLifetime
}: ISettingsUserSubscriptionPurchaseSubscriptionStripe) => {

  return (
    <Container>
      <Header>
        Please enter your card information: 
      </Header>
      <StripeProvider apiKey={environment.stripeKey}>
        <Elements>
          <StripePurchaseSubscription
            monthlyOrLifetimeSubscription={monthlyOrLifetime}/>
        </Elements>
      </StripeProvider>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsUserSubscriptionPurchaseSubscriptionStripe {
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
export default SettingsUserSubscriptionPurchaseSubscriptionStripe
