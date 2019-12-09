//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscription = () => {
  
  const userSubscriptionType = useSelector((state: IAppState) => state.user.subscription.type)
  
  const userSubscriptionTypeMessages = {
    DEMO: 'You are a demo user',
    TRIAL: 'You are a trial user',
    MONTHLY: 'You have a monthly billing plan',
    LIFETIME: "Thank you for your lifetime membership! We don't need any of your billing information."
  }
  
  return (
    <Container>
      {userSubscriptionTypeMessages[userSubscriptionType]}
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
