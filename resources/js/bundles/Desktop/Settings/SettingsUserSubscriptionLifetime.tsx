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
const SettingsUserSubscriptionLifetime = () => {

  const userSubscriptionStartDate = useSelector((state: IAppState) => state.user.tasksheetSubscription.subscriptionStartDate)
  
  return (
    <Container
      data-testid="SettingsUserSubscriptionLifetime">
      Your lifetime subscription was succesfully purchased on <b>{moment(userSubscriptionStartDate).format('MMMM Do, YYYY')}</b>. Thank you for choosing Tasksheet!
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
export default SettingsUserSubscriptionLifetime
