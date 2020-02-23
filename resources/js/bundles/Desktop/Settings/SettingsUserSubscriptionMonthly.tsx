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
  
  const userSubscriptionType = useSelector((state: IAppState) => state.user.tasksheetSubscription.type)
  const userSubscriptionSubscriptionEndDate = useSelector((state: IAppState) => state.user.tasksheetSubscription.subscriptionEndDate)
  const userSubscriptionTrialEndDate = useSelector((state: IAppState) => state.user.tasksheetSubscription.trialEndDate)

  const firstBillingOrNextBilling = userSubscriptionType === 'MONTHLY_STILL_IN_TRIAL' ? 'first' : 'next'
  const billingDate = userSubscriptionType === 'MONTHLY_STILL_IN_TRIAL' 
    ? moment(userSubscriptionTrialEndDate).format('MMMM Do, YYYY')
    : moment(userSubscriptionSubscriptionEndDate).format('MMMM Do, YYYY')
  
  return (
    <Container
      data-testid="SettingsUserSubscriptionMonthly">
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
