//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SettingsUserSubscriptionMonthlyCancelSubscription from '@desktop/Settings/SettingsUserSubscriptionMonthlyCancelSubscription'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionMonthly = () => {
  
  const userSubscriptionBillingDayOfMonth = useSelector((state: IAppState) => 
    state.user.tasksheetSubscription.billingDayOfMonth &&
    moment.localeData().ordinal(state.user.tasksheetSubscription.billingDayOfMonth)
  )

  return (
    <Container
      data-testid="SettingsUserSubscriptionMonthly">
      <SubscriptionStatus>
        Your monthly subscription is active
        {userSubscriptionBillingDayOfMonth 
          ? <span> and your card will be charged each month on the <b>{userSubscriptionBillingDayOfMonth}</b>. </span>
          : '. '
        }
        Thank you for choosing Tasksheet!
      </SubscriptionStatus>
      <SettingsUserSubscriptionMonthlyCancelSubscription />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SubscriptionStatus = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionMonthly
