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
            setPasswordInputValue('')
            setCancelSubscriptionStatus('ERROR')
          }, 500)
        }
      })
  }

  return (
    <Container>
      <InputContainer>
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
      </InputContainer>
      <CancelSubscriptionMessage
        data-testid="CancelSubscriptionMessage"
        cancelSubscriptionStatus={cancelSubscriptionStatus}>
        {cancelSubscriptionMessages[cancelSubscriptionStatus]}
      </CancelSubscriptionMessage>
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

export const cancelSubscriptionMessages = {
  READY: "",
  CONFIRM_CANCELLATION: "Your subscription will be cancelled immediately. You will still have access all of your sheets, but will no longer be able to edit or add to them. You can restart your subscription at any time.",
  CANCELLING: "Your cancellation is being processed...",
  INCORRECT_PASSWORD: "Your password was incorrect. Please try again.",
  ERROR: "There was a problem processing your cancellation. Please try again.",
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
  width: 25rem;
`

const InputContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const CancelSubscriptionButton = styled(SettingsButton)`
  margin-left: 0.25rem;
  width: 10rem;
`

const ClosePasswordInputButton = styled(SettingsButton)`
  display: ${ ({ cancelSubscriptionStatus }: IClosePasswordInputButton) => cancelSubscriptionStatus !== 'READY' ? 'block' : 'none'};
  margin-left: 0.25rem;
  padding: 0.3125rem;
`
interface IClosePasswordInputButton {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

const PasswordInput = styled.input`
  display: ${ ({ cancelSubscriptionStatus }: IPasswordInput) => cancelSubscriptionStatus !== 'READY' ? 'block' : 'none'};
  padding: 0.5rem;
  width: 12.5rem;
  font-size: 0.8rem;
  border-radius: 5px;
  border: ${ ({ cancelSubscriptionStatus }: IPasswordInput) => ['INCORRECT_PASSWORD', 'ERROR'].includes(cancelSubscriptionStatus) ? '1px solid red' : '1px solid rgb(150, 150, 150)'};
  outline: none;
`
interface IPasswordInput {
  cancelSubscriptionStatus: ICancelSubscriptionStatus
}

const CancelSubscriptionMessage = styled.div`
  margin-top: ${ ({ cancelSubscriptionStatus }: IPasswordInput) => cancelSubscriptionStatus !== 'READY' ? '0.5rem' : '0'};
  text-align: right;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionMonthlyCancelSubscription
