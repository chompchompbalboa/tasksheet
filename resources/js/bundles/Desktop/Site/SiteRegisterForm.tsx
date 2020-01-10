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
import SiteFormInput from '@desktop/Site/SiteFormInput'

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
        placeholder="Name"
        value={nameInputValue}
        onChange={nextValue => setNameInputValue(nextValue)}
        isInputValueValid={true}/>
      <SiteFormInput
        type="email"
        placeholder="Email"
        value={emailInputValue}
        onChange={nextValue => setEmailInputValue(nextValue)}
        isInputValueValid={emailInputValue === '' || isEmail(emailInputValue)}/>
      <SiteFormInput
        type="password"
        placeholder="Password"
        value={passwordInputValue}
        onChange={nextValue => setPasswordInputValue(nextValue)}
        isInputValueValid={true}/>
      <SiteFormButton
        text={!['REGISTERING'].includes(registerStatus) ? 'Sign Up' : 'Signing Up...'} />
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
  align-items: center;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`

export default SiteRegisterForm
