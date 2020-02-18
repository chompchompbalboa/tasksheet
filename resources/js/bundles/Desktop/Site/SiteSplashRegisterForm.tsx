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
export const SiteSplashRegisterForm = () => {
  
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
    if(emailInputValue === '' || nameInputValue === '' || passwordInputValue === '') {
      setTimeout(() => {
        setRegisterStatus('NOT_ALL_FIELDS_ARE_COMPLETE')
      }, 500)
    }
    else if(!isEmail(emailInputValue)) {
      setTimeout(() => {
        setRegisterStatus('NOT_VALID_EMAIL')
      }, 500)
    }
    else if(!startTrialCheckboxValue) {
      setTimeout(() => {
        setRegisterStatus('START_TRIAL_CHECKBOX_NOT_CHECKED')
      }, 500)
    }
    else {
      action.userRegister(nameInputValue, emailInputValue, passwordInputValue)
        .then(() => {
          window.location.reload()
        })
        .catch(error => {
          if(error.response.status === 409) {
            setTimeout(() => {
              setRegisterStatus('EMAIL_ALREADY_IN_USE')
            }, 500)
          }
          else {
            setTimeout(() => {
              setRegisterStatus('ERROR_DURING_REGISTRATION')
            }, 500)
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
      <SiteFormCheckbox
        label="I agree to start a 30-day free trial of Tasksheet (no credit card required)"
        onChange={nextValue => setStartTrialCheckboxValue(nextValue)}
        checked={startTrialCheckboxValue} />
      <SiteFormButton
        marginLeft="0"
        marginTop="0.5rem"
        text={!['REGISTERING'].includes(registerStatus) ? 'Sign Up' : 'Signing Up...'} />
      <SiteFormStatus
        testId="SiteSplashRegisterFormStatus"
        status={siteSplashRegisterFormStatusMessages[registerStatus]}/> 
    </RegisterForm>
  )
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
type IRegisterStatus = 
  'READY' | 
  'REGISTERING' | 
  'NOT_ALL_FIELDS_ARE_COMPLETE' |
  'NOT_VALID_EMAIL' |
  'START_TRIAL_CHECKBOX_NOT_CHECKED' | 
  'EMAIL_ALREADY_IN_USE' |
  'ERROR_DURING_REGISTRATION'
  
// Status Messages
export const siteSplashRegisterFormStatusMessages = {
  READY: "",
  REGISTERING: "",
  NOT_ALL_FIELDS_ARE_COMPLETE: "Please enter your name, email, and password and click the checkbox above to start your free trial",
  NOT_VALID_EMAIL: "Please enter a valid email address",
  START_TRIAL_CHECKBOX_NOT_CHECKED: "Please click the checkbox above to start your free trial",
  EMAIL_ALREADY_IN_USE: "That email address is already in use",
  ERROR_DURING_REGISTRATION: "We were unable to sign you up for an account. Please make sure you have entered all of your information correctly and try again."
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const RegisterForm = styled.form`
  width: 100%;
`

export default SiteSplashRegisterForm
