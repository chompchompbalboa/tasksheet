//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import StripePurchaseSubscriptionPaymentForm from '@desktop/Stripe/StripePurchaseSubscriptionPaymentForm'
import StripePurchaseSubscriptionSubscriptionTypes from '@desktop/Stripe/StripePurchaseSubscriptionSubscriptionTypes'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscription = () => {

  // State
  const [ monthlyOrLifetime, setMonthlyOrLifetime ] = useState('MONTHLY' as 'MONTHLY' | 'LIFETIME')

  return (
    <Container>
      <StripePurchaseSubscriptionSubscriptionTypes
        monthlyOrLifetime={monthlyOrLifetime}
        setMonthlyOrLifetime={setMonthlyOrLifetime}/>
      <StripePurchaseSubscriptionPaymentForm
        monthlyOrLifetime={monthlyOrLifetime}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default StripePurchaseSubscription
