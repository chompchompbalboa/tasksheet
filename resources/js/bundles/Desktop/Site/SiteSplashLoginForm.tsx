//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import styled from 'styled-components'
import { isEmail } from 'validator'

import { action } from '@/api'

import SiteFormButton from '@desktop/Site/SiteFormButton'
import SiteFormInput from '@desktop/Site/SiteFormInput'
import SiteFormStatus from '@desktop/Site/SiteFormStatus'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SiteSplashLoginForm = ({
  flexDirection = 'column',
  inputsMarginLeft = '0',
  isDisplayLabels = true,
  statusTextAlign = 'left'
}: ISiteSplashLoginForm) => {

  // State
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  const [ loginStatus, setLoginStatus ] = useState('READY' as ILoginStatus)
  
  // Handle Login Attempt
  const handleLoginAttempt = (e: FormEvent) => {
    e.preventDefault()
    setLoginStatus('LOGGING_IN')
    if(emailInputValue === '' || passwordInputValue === '') {
      setTimeout(() => {
        setLoginStatus('NOT_ALL_FIELDS_ARE_COMPLETE')
      }, 500)
    }
    else if (!isEmail(emailInputValue)) {
      setTimeout(() => {
        setLoginStatus('NOT_VALID_EMAIL')
      }, 500)
    }
    else {
      action.userLogin(emailInputValue, passwordInputValue)
        .then(() => {
          window.location.reload()
        })
        .catch(() => {
          setTimeout(() => {
            setLoginStatus('ERROR_DURING_LOGIN')
          }, 500)
        })
    }
  }
  
  return (
    <LoginForm 
      onSubmit={e => handleLoginAttempt(e)}>
      <InputsContainer
        flexDirection={flexDirection}>
        <SiteFormInput
          label={isDisplayLabels && "Email"}
          marginLeft={inputsMarginLeft}
          type="email"
          placeholder="Email"
          value={emailInputValue}
          onChange={nextValue => setEmailInputValue(nextValue)}
          isInputValueValid={emailInputValue === '' || isEmail(emailInputValue)}/>
        <SiteFormInput
          label={isDisplayLabels && "Password"}
          marginLeft={inputsMarginLeft}
          type="password"
          placeholder="Password"
          value={passwordInputValue}
          onChange={nextValue => setPasswordInputValue(nextValue)}
          isInputValueValid={true}/>
        <SiteFormButton
          marginTop={flexDirection === 'column' ? '0.5rem' : '0'}
          marginLeft={flexDirection === 'column' ? '0' : '0.375rem'}
          text={!['LOGGING_IN'].includes(loginStatus) ? 'Log In' : 'Logging In...'} />
      </InputsContainer>
      <StatusContainer>
        <SiteFormStatus
          testId="SiteSplashLoginFormStatus"
          status={siteSplashLoginFormStatusMessages[loginStatus]}
          statusTextAlign={statusTextAlign}/>
      </StatusContainer>
    </LoginForm>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteSplashLoginForm {
  flexDirection?: 'column' | 'row'
  isDisplayLabels?: boolean
  inputsMarginLeft?: string
  statusTextAlign?: string
}

type ILoginStatus = 
  'READY' | 
  'NOT_ALL_FIELDS_ARE_COMPLETE' |
  'NOT_VALID_EMAIL' |
  'LOGGING_IN' | 
  'ERROR_DURING_LOGIN'

  
// Status Messages
export const siteSplashLoginFormStatusMessages = {
  READY: "",
  NOT_ALL_FIELDS_ARE_COMPLETE: "Please enter your email and password to login",
  NOT_VALID_EMAIL: "Please enter a valid email address",
  LOGGING_IN: "",
  ERROR_DURING_LOGIN: "We were unable to log you in. Please check your username and password and try again."
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const InputsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${ ({ flexDirection }: IInputsContainer ) => flexDirection }; 
  justify-content: center;
  align-items: center;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`
interface IInputsContainer {
  flexDirection: string
}

const StatusContainer = styled.div`
  width: 100%;
`

export default SiteSplashLoginForm
