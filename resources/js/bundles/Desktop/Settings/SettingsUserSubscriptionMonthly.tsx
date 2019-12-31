//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionMonthly = () => {
  
  const stripeSubscriptionStatus = useSelector((state: IAppState) => state.user.stripeSubscription.stripe_status)
  const stripeSubscriptionTrialEndsAt = useSelector((state: IAppState) => state.user.stripeSubscription.trial_ends_at)
  const stripeSubscriptionEndsAt = useSelector((state: IAppState) => state.user.stripeSubscription.ends_at)
  
  const firstBillingOrNextBilling = stripeSubscriptionStatus === 'trialing' ? 'first' : 'next'
  const billingDate = stripeSubscriptionStatus === 'trialing' 
    ? moment(stripeSubscriptionTrialEndsAt).format('MMMM Do, YYYY')
    : moment(stripeSubscriptionEndsAt).format('MMMM Do, YYYY')
  
  return (
    <Container>
      Thank you for your monthly subscription! Your {firstBillingOrNextBilling} billing will occur on <b>{billingDate}.</b>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionMonthly
