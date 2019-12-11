//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import SettingsUserSubscriptionDemo from '@app/bundles/Settings/SettingsUserSubscriptionDemo'
import SettingsUserSubscriptionTrial from '@app/bundles/Settings/SettingsUserSubscriptionTrial'
import SettingsUserSubscriptionMonthly from '@app/bundles/Settings/SettingsUserSubscriptionMonthly'
import SettingsUserSubscriptionLifetime from '@app/bundles/Settings/SettingsUserSubscriptionLifetime'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscription = () => {
  
  const userSubscriptionType = useSelector((state: IAppState) => state.user.subscription.type)
  
  const userSubscriptionComponents = {
    DEMO: SettingsUserSubscriptionDemo,
    TRIAL: SettingsUserSubscriptionTrial,
    MONTHLY: SettingsUserSubscriptionMonthly,
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
