//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import Icon from '@/components/Icon'
import SettingsButton from '@desktop/Settings/SettingsButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionMonthlyCancelSubscription = () => {

  const [ cancelSubscriptionStatus, setCancelSubscriptionStatus ] = useState('READY' as ICancelSubscriptionStatus)
  const [ cancelSubscriptionConfirmEmailValue, setCancelSubscriptionConfirmEmailValue ] = useState('')

  const cancelSubscriptionStatusOnClicks = {
    READY: () => {
      setCancelSubscriptionConfirmEmailValue('')
      setCancelSubscriptionStatus('CONFIRM_CANCELLATION')
    },
    CONFIRM_CANCELLATION: () => {
      setCancelSubscriptionStatus('CANCELLING')
    },
    CANCELLING: () => {},
  }

  return (
    <Container>
      <ConfirmCancellationInput
        cancelSubscriptionStatus={cancelSubscriptionStatus}
        onChange={e => setCancelSubscriptionConfirmEmailValue(e.target.value)}
        placeholder="Enter your password"
        value={cancelSubscriptionConfirmEmailValue}/>
      <CloseInputButton
        backgroundColorHover="red"
        cancelSubscriptionStatus={cancelSubscriptionStatus}
        onClick={() => setCancelSubscriptionStatus('READY')}>
        <Icon
          icon={CLOSE}
          size="1.25rem"/>
      </CloseInputButton>
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
  margin-left: 1rem;
  display: flex;
  align-items: center;
`

const CancelSubscriptionButton = styled(SettingsButton)`
  margin-left: 0.25rem;
`

const CloseInputButton = styled(SettingsButton)`
  display: ${ ({ cancelSubscriptionStatus }: ICloseInputButton) => ['CONFIRM_CANCELLATION', 'CANCELLING'].includes(cancelSubscriptionStatus) ? 'block' : 'none'};
  margin-left: 0.25rem;
  padding: 0.25rem;
`
interface ICloseInputButton {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

const ConfirmCancellationInput = styled.input`
  display: ${ ({ cancelSubscriptionStatus }: IConfirmCancellationInput) => ['CONFIRM_CANCELLATION', 'CANCELLING'].includes(cancelSubscriptionStatus) ? 'block' : 'none'};
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid rgb(150, 150, 150);
  outline: none;
`
interface IConfirmCancellationInput {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionMonthlyCancelSubscription
