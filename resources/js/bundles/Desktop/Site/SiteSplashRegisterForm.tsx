//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import styled from 'styled-components'
import { isEmail } from 'validator'

import { action } from '@/api'

import SiteFormButton from '@desktop/Site/SiteFormButton'
import SiteFormCheckbox from '@desktop/Site/SiteFormCheckbox'
import SiteFormInput from '@desktop/Site/SiteFormInput'
import SiteFormStatus from '@desktop/Site/SiteFormStatus'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteSplashRegisterForm = () => {
  
  // State
  const [ nameInputValue, setNameInputValue ] = useState('')
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  const [ startTrialCheckboxValue, setStartTrialCheckboxValue ] = useState(false)
  const [ registerStatus, setRegisterStatus ] = useState('READY' as IRegisterStatus)
  
  // Handle Register Attempt
  const handleRegisterAttempt = (e: FormEvent) => {
    e.preventDefault()
    setRegisterStatus('REGISTERING')
    if(!startTrialCheckboxValue) {
      setTimeout(() => {
        setRegisterStatus('START_TRIAL_CHECKBOX_NOT_CHECKED')
      }, 500)
    }
    else if(isEmail(emailInputValue) && passwordInputValue) {
      action.userRegister(nameInputValue, emailInputValue, passwordInputValue).then(
        response => {
          if(response.status === 200) {
            window.location = window.location.href as any
          }
          else {
            setTimeout(() => {
              setRegisterStatus('ERROR_DURING_REGISTRATION')
            }, 500)
          }
      })
    }
  }
  
  // Status Messages
  const statusMessages = {
    READY: "",
    REGISTERING: "",
    START_TRIAL_CHECKBOX_NOT_CHECKED: "Please click the checkbox above to start your free trial",
    ERROR_DURING_REGISTRATION: "We were unable to sign you up for an account. Please make sure you have entered all of your information correctly and try again."
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
      <SiteFormCheckbox
        label="I agree to start a 30-day free trial of Tasksheet (no credit card required)"
        onChange={nextValue => setStartTrialCheckboxValue(nextValue)}
        checked={startTrialCheckboxValue} />
      <SiteFormButton
        marginLeft="0"
        marginTop="0.5rem"
        text={!['REGISTERING'].includes(registerStatus) ? 'Sign Up' : 'Signing Up...'} />
      {statusMessages[registerStatus] &&
        <SiteFormStatus
          status={statusMessages[registerStatus]}/>
      }  
    </RegisterForm>
  )
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
type IRegisterStatus = 'READY' | 'REGISTERING' | 'START_TRIAL_CHECKBOX_NOT_CHECKED' | 'ERROR_DURING_REGISTRATION'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const RegisterForm = styled.form`
  width: 100%;
`

export default SiteSplashRegisterForm
