//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SettingsUserSubscriptionTrialExpirationDate from '@desktop/Settings/SettingsUserSubscriptionTrialExpirationDate'
import StripePurchaseSubscription from '@desktop/Stripe/StripePurchaseSubscription'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionTrial = () => {

  return (
    <Container
      data-testid="SettingsUserSubscriptionTrial">
      <SettingsUserSubscriptionTrialExpirationDate />
      <StripePurchaseSubscription />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionTrial
