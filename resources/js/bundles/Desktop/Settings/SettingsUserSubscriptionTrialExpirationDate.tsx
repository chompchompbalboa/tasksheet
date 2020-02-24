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
const SettingsUserSubscriptionTrial = () => {

  // Redux
  const userSubscriptionTrialEndDate = useSelector((state: IAppState) => state.user.tasksheetSubscription.trialEndDate)

  return (
    <Container>
      Your 30-day free trial expires on <b>{moment(userSubscriptionTrialEndDate).format('MMMM Do, YYYY')}. </b>
      If you'd like to continue using Tasksheet after that date, please choose one of our two subscription plans below.
      Both plans include unlimited access to all Tasksheet features.
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-bottom: 1rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionTrial
