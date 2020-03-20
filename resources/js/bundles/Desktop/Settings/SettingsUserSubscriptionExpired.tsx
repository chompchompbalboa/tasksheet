//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import StripePurchaseSubscription from '@desktop/Stripe/StripePurchaseSubscription'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionExpired = () => {

  return (
    <Container
      data-testid="SettingsUserSubscriptionExpired">
      <SubscriptionExpiredMessage>
        Your Tasksheet subscription is no longer active. You can still view all of your sheets, but are no longer able to edit existing sheets or create new sheets.
        If you'd like to restore full access to Tasksheet, please choose one of our two subscription plans below. 
        Both plans include unlimited access to all Tasksheet features.
      </SubscriptionExpiredMessage>
      <StripePurchaseSubscription />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

const SubscriptionExpiredMessage= styled.div`
  width: 50%;
  margin-bottom: 1rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionExpired
