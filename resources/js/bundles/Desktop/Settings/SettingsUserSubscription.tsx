//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SettingsUserSubscriptionBeta from '@desktop/Settings/SettingsUserSubscriptionBeta'
import SettingsUserSubscriptionDemo from '@desktop/Settings/SettingsUserSubscriptionDemo'
import SettingsUserSubscriptionExpired from '@desktop/Settings/SettingsUserSubscriptionExpired'
import SettingsUserSubscriptionTrial from '@desktop/Settings/SettingsUserSubscriptionTrial'
import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'
import SettingsUserSubscriptionLifetime from '@desktop/Settings/SettingsUserSubscriptionLifetime'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscription = () => {
  
  const userSubscriptionType = useSelector((state: IAppState) => state.user.tasksheetSubscription.type)
  
  const userSubscriptionComponents = {
    BETA: SettingsUserSubscriptionBeta,
    DEMO: SettingsUserSubscriptionDemo,
    TRIAL: SettingsUserSubscriptionTrial,
    TRIAL_EXPIRED: SettingsUserSubscriptionExpired,
    MONTHLY: SettingsUserSubscriptionMonthly,
    MONTHLY_PAST_DUE: SettingsUserSubscriptionMonthly,
    MONTHLY_EXPIRED: SettingsUserSubscriptionExpired,
    LIFETIME: SettingsUserSubscriptionLifetime
  }
  
  const UserSubscriptionComponent = userSubscriptionComponents[userSubscriptionType]
  
  return (
    <Container>
      <UserSubscriptionComponent />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0.125rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscription
