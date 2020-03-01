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
  
  const userSubscriptionBillingDayOfMonth = useSelector((state: IAppState) => 
    state.user.tasksheetSubscription.billingDayOfMonth &&
    moment.localeData().ordinal(state.user.tasksheetSubscription.billingDayOfMonth)
  )

  return (
    <Container
      data-testid="SettingsUserSubscriptionMonthly">
      Your monthly subscription is active
      {userSubscriptionBillingDayOfMonth 
        ? <span> and your card will be charged each month on the <b>{userSubscriptionBillingDayOfMonth}</b>. </span>
        : '. '
      }
      Thank you for choosing Tasksheet!
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
