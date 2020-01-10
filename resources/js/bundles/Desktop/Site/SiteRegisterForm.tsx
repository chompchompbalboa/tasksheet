//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { isEmail } from 'validator'

import { action } from '@/api'

import {
  updateActiveSiteFormMessage
} from '@/state/active/actions'

import SiteFormButton from '@desktop/Site/SiteFormButton'
import SiteFormCheckbox from '@desktop/Site/SiteFormCheckbox'
import SiteFormInput from '@desktop/Site/SiteFormInput'
import SiteFormStatus from '@desktop/Site/SiteFormStatus'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteRegisterForm = () => {
  
  // Redux
  const dispatch = useDispatch()
  
  // State
  const [ nameInputValue, setNameInputValue ] = useState('')
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  const [ confirmPasswordInputValue, setConfirmPasswordInputValue ] = useState('')
  const [ accessCodeInputValue, setAccessCodeInputValue ] = useState('')
  const [ startTrialCheckboxValue, setStartTrialCheckboxValue ] = useState(false)
  const [ registerStatus, setRegisterStatus ] = useState('READY')
  
  // Handle Register Attempt
  const handleRegisterAttempt = (e: FormEvent) => {
    e.preventDefault()
    if(isEmail(emailInputValue)) {
      setRegisterStatus('REGISTERING')
      action.userRegister(nameInputValue, emailInputValue, passwordInputValue).then(
        response => {
          if(response.status === 200) {
            window.location = window.location.href as any
          }
          else {
            setTimeout(() => {
              setRegisterStatus('READY')
              dispatch(updateActiveSiteFormMessage('ERROR_DURING_REGISTRATION'))
            }, 500)
            setTimeout(() => {
              dispatch(updateActiveSiteFormMessage('CLICK_TO_LOGIN_INSTEAD'))
            }, 5000)
          }
      })
    }
  }
  
  return (
    <RegisterForm onSubmit={e => handleRegisterAttempt(e)}>
      <SiteFormInput
        label="Name"
        placeholder="Name"
        value={nameInputValue}
        onChange={nextValue => setNameInputValue(nextValue)}
        isInputValueValid={true}/>
      <SiteFormInput
        label="Email"
        type="email"
        placeholder="Email"
        value={emailInputValue}
        onChange={nextValue => setEmailInputValue(nextValue)}
        isInputValueValid={emailInputValue === '' || isEmail(emailInputValue)}/>
      <SiteFormInput
        label="Password"
        type="password"
        placeholder="Password"
        value={passwordInputValue}
        onChange={nextValue => setPasswordInputValue(nextValue)}
        isInputValueValid={true}/>
      <SiteFormInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        value={confirmPasswordInputValue}
        onChange={nextValue => setConfirmPasswordInputValue(nextValue)}
        isInputValueValid={confirmPasswordInputValue === '' || confirmPasswordInputValue === passwordInputValue}/>
      <SiteFormInput
        label="Access Code"
        placeholder="Access Code"
        value={accessCodeInputValue}
        onChange={nextValue => setAccessCodeInputValue(nextValue)}
        isInputValueValid={true}/>
      <SiteFormCheckbox
        label="I agree to start a 30-day free trial of Tasksheet (no credit card required)"
        onChange={nextValue => setStartTrialCheckboxValue(nextValue)}
        checked={startTrialCheckboxValue} />
      <SiteFormButton
        marginLeft="0"
        marginTop="0.5rem"
        text={!['REGISTERING'].includes(registerStatus) ? 'Sign Up' : 'Signing Up...'} />
      <SiteFormStatus
        status=""/>
    </RegisterForm>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const RegisterForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`

export default SiteRegisterForm
