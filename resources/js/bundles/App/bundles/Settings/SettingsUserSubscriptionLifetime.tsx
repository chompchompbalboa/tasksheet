//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionLifetime = () => {

  const userSubscriptionStartDate = useSelector((state: IAppState) => state.user.subscription.startDate)
  
  return (
    <Container>
      Your lifetime membership was succesfully purchased on {moment(userSubscriptionStartDate).format('MMMM Do, YYYY')}. Thank you for choosing Tasksheet!
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