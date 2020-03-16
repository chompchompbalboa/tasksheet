//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import SettingsSubmitButton from '@desktop/Settings/SettingsSubmitButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionMonthlyCancelSubscription = () => {

  const [ cancelSubscriptionStatus, setCancelSubscriptionStatus ] = useState('READY' as ICancelSubscriptionStatus)
  const [ cancelSubscriptionConfirmEmailValue, setCancelSubscriptionConfirmEmailValue ] = useState('')

  const cancelSubscriptionStatusOnClicks = {
    READY: () => setCancelSubscriptionStatus('CONFIRM_CANCELLATION'),
    CONFIRM_CANCELLATION: () => {
      setCancelSubscriptionStatus('CANCELLING')
    },
    CANCELLING: () => {},
  }

  return (
    <Container
      data-testid="SettingsUserSubscriptionMonthlyCancelSubscription">
      <ConfirmCancellationInput
        cancelSubscriptionStatus={cancelSubscriptionStatus}
        onChange={e => setCancelSubscriptionConfirmEmailValue(e.target.value)}
        placeholder="Enter your password"
        value={cancelSubscriptionConfirmEmailValue}/>
      <CancelSubscriptionButton
        onClick={cancelSubscriptionStatusOnClicks[cancelSubscriptionStatus]}
        text={cancelSubscriptionStatusButtonText[cancelSubscriptionStatus]}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Messages
//-----------------------------------------------------------------------------
export const cancelSubscriptionStatusButtonText = {
  READY: "Cancel Subscription",
  CONFIRM_CANCELLATION: "Confirm Cancellation",
  CANCELLING: "Cancelling..."
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
type ICancelSubscriptionStatus = 
  'READY' |
  'CONFIRM_CANCELLATION' |
  'CANCELLING'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  align-items: center;
`

const CancelSubscriptionButton = styled(SettingsSubmitButton)`
  margin-left: 0.5rem;
`

const ConfirmCancellationInput = styled.input`
  display: ${ ({ cancelSubscriptionStatus }: IConfirmCancellationInput) => ['CONFIRM_CANCELLATION', 'CANCELLING'].includes(cancelSubscriptionStatus) ? 'block' : 'none'};
`
interface IConfirmCancellationInput {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionMonthlyCancelSubscription
