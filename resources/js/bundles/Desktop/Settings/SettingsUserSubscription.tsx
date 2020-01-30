//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SettingsUserSubscriptionDemo from '@desktop/Settings/SettingsUserSubscriptionDemo'
import SettingsUserSubscriptionTrial from '@desktop/Settings/SettingsUserSubscriptionTrial'
import SettingsUserSubscriptionMonthly from '@desktop/Settings/SettingsUserSubscriptionMonthly'
import SettingsUserSubscriptionLifetime from '@desktop/Settings/SettingsUserSubscriptionLifetime'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscription = () => {
  
  const userSubscriptionType = useSelector((state: IAppState) => state.user.sortsheetSubscription.type)
  
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
