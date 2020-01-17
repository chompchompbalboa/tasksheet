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
const SiteRegisterForm = () => {
  
  // State
  const [ nameInputValue, setNameInputValue ] = useState('')
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  const [ confirmPasswordInputValue, setConfirmPasswordInputValue ] = useState('')
  const [ accessCodeInputValue, setAccessCodeInputValue ] = useState('')
  const [ startTrialCheckboxValue, setStartTrialCheckboxValue ] = useState(false)
  const [ registerStatus, setRegisterStatus ] = useState('READY' as IRegisterStatus)
  
  // Handle Register Attempt
  const handleRegisterAttempt = (e: FormEvent) => {
    e.preventDefault()
    if(isEmail(emailInputValue) && passwordInputValue === confirmPasswordInputValue && startTrialCheckboxValue) {
      setRegisterStatus('REGISTERING')
      if(accessCodeInputValue === 'EARLY_ACCESS') {
        action.userRegister(nameInputValue, emailInputValue, passwordInputValue, accessCodeInputValue).then(
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
      else {
        setTimeout(() => {
          setRegisterStatus('INCORRECT_ACCESS_CODE')
        }, 500)
      }
    }
  }
  
  // Status Messages
  const statusMessages = {
    READY: "",
    REGISTERING: "",
    INCORRECT_ACCESS_CODE: "Your access code is incorrect. Tasksheet is in closed beta and requires an access code to sign up for an account.",
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
        status={statusMessages[registerStatus]}/>
    </RegisterForm>
  )
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
type IRegisterStatus = 'READY' | 'REGISTERING' | 'INCORRECT_ACCESS_CODE' | 'ERROR_DURING_REGISTRATION'

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
