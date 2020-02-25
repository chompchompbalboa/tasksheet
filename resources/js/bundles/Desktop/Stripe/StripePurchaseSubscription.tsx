//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { ITasksheetSubscriptionPlan } from '@/state/user/types'

import StripePurchaseSubscriptionPaymentForm from '@desktop/Stripe/StripePurchaseSubscriptionPaymentForm'
import StripePurchaseSubscriptionSubscriptionTypes from '@desktop/Stripe/StripePurchaseSubscriptionSubscriptionTypes'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscription = () => {

  // State
  const [ activeSubscriptionPlan, setActiveSubscriptionPlan ] = useState('MONTHLY' as ITasksheetSubscriptionPlan)

  return (
    <Container>
      <StripePurchaseSubscriptionSubscriptionTypes
        activeSubscriptionPlan={activeSubscriptionPlan}
        setActiveSubscriptionPlan={setActiveSubscriptionPlan}/>
      <StripePurchaseSubscriptionPaymentForm
        activeSubscriptionPlan={activeSubscriptionPlan}/>
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
