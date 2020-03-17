//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { action } from '@/api'

import { CLOSE } from '@/assets/icons'

import { IAppState } from '@/state'

import Icon from '@/components/Icon'
import SettingsButton from '@desktop/Settings/SettingsButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionMonthlyCancelSubscription = () => {

  // Redux
  const userId = useSelector((state: IAppState) => state.user.id)

  // State
  const [ cancelSubscriptionStatus, setCancelSubscriptionStatus ] = useState('READY' as ICancelSubscriptionStatus)
  const [ passwordInputValue, setPasswordInputValue ] = useState('')

  // Cancel Subscription 
  const cancelSubscriptionButtonOnClicks = {
    READY: () => {
      setPasswordInputValue('')
      setCancelSubscriptionStatus('CONFIRM_CANCELLATION')
    },
    CONFIRM_CANCELLATION: () => handleCancelSubscription(),
    CANCELLING: () => {},
    INCORRECT_PASSWORD: () => handleCancelSubscription(),
    ERROR: () => handleCancelSubscription()
  }

  // Handle Cancel Subscription
  const handleCancelSubscription = () => {
    setCancelSubscriptionStatus('CANCELLING')
    action.userSubscriptionCancelMonthly(userId, passwordInputValue)
      .then()
      .catch(error => {
        if(error.response.status === 401) {
          setTimeout(() => {
            setPasswordInputValue('')
            setCancelSubscriptionStatus('INCORRECT_PASSWORD')
          }, 500)
        }
        else {
          setTimeout(() => {
            setCancelSubscriptionStatus('ERROR')
          }, 500)
        }
      })
  }

  return (
    <Container>
      <PasswordInput
        type="password"
        cancelSubscriptionStatus={cancelSubscriptionStatus}
        onChange={e => setPasswordInputValue(e.target.value)}
        placeholder={cancelSubscriptionStatus === 'INCORRECT_PASSWORD' ? "Incorrect Password" : "Enter your password"}
        value={passwordInputValue}/>
      <ClosePasswordInputButton
        testId="ClosePasswordInputButton"
        backgroundColorHover="red"
        cancelSubscriptionStatus={cancelSubscriptionStatus}
        onClick={() => setCancelSubscriptionStatus('READY')}>
        <Icon
          icon={CLOSE}
          size="1.125rem"/>
      </ClosePasswordInputButton>
      <CancelSubscriptionButton
        isDisabled={cancelSubscriptionStatus === 'CONFIRM_CANCELLATION' && passwordInputValue === ''}
        onClick={cancelSubscriptionButtonOnClicks[cancelSubscriptionStatus]}
        text={cancelSubscriptionButtonText[cancelSubscriptionStatus]}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Messages
//-----------------------------------------------------------------------------
export const cancelSubscriptionButtonText = {
  READY: "Cancel Subscription",
  CONFIRM_CANCELLATION: "Confirm Cancellation",
  CANCELLING: "Cancelling...",
  INCORRECT_PASSWORD: "Confirm Cancellation",
  ERROR: "Confirm Cancellation",
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
type ICancelSubscriptionStatus = 
  'READY' |
  'CONFIRM_CANCELLATION' |
  'CANCELLING' |
  'INCORRECT_PASSWORD' |
  'ERROR'

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

const ClosePasswordInputButton = styled(SettingsButton)`
  display: ${ ({ cancelSubscriptionStatus }: IClosePasswordInputButton) => ['CONFIRM_CANCELLATION', 'INCORRECT_PASSWORD', 'ERROR'].includes(cancelSubscriptionStatus) ? 'block' : 'none'};
  margin-left: 0.25rem;
  padding: 0.3125rem;
`
interface IClosePasswordInputButton {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

const PasswordInput = styled.input`
  display: ${ ({ cancelSubscriptionStatus }: IPasswordInput) => ['CONFIRM_CANCELLATION', 'INCORRECT_PASSWORD', 'ERROR'].includes(cancelSubscriptionStatus) ? 'block' : 'none'};
  padding: 0.5rem;
  min-width: 10rem;
  font-size: 0.8rem;
  border-radius: 5px;
  border: ${ ({ cancelSubscriptionStatus }: IPasswordInput) => ['INCORRECT_PASSWORD', 'ERROR'].includes(cancelSubscriptionStatus) ? '1px solid red' : '1px solid rgb(150, 150, 150)'};
  outline: none;
`
interface IPasswordInput {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionMonthlyCancelSubscription
