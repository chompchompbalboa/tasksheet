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
const SiteLoginForm = ({
  flexDirection = 'row',
  isDisplayLabels = false
}: ISiteLoginForm) => {
  
  const dispatch = useDispatch()

  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  const [ loginStatus, setLoginStatus ] = useState('READY')
  
  const handleLoginAttempt = (e: FormEvent) => {
    e.preventDefault()
    if(isEmail(emailInputValue)) {
      setLoginStatus('LOGGING_IN')
      action.userLogin(emailInputValue, passwordInputValue).then(
        response => {
          if(response.status === 200) {
            window.location = window.location.href as any
          }
          else {
            setTimeout(() => {
              setLoginStatus('READY')
              dispatch(updateActiveSiteFormMessage('ERROR_DURING_LOGIN'))
            }, 500)
            setTimeout(() => {
              dispatch(updateActiveSiteFormMessage('CLICK_TO_REGISTER_INSTEAD'))
            }, 5000)
          }
      })
    }
  }
  
  return (
    <LoginForm 
      flexDirection={flexDirection}
      onSubmit={e => handleLoginAttempt(e)}>
      <SiteFormInput
        label={isDisplayLabels && "Email"}
        type="email"
        placeholder="Email"
        value={emailInputValue}
        onChange={nextValue => setEmailInputValue(nextValue)}
        isInputValueValid={emailInputValue === '' || isEmail(emailInputValue)}/>
      <SiteFormInput
        label={isDisplayLabels && "Password"}
        type="password"
        placeholder="Password"
        value={passwordInputValue}
        onChange={nextValue => setPasswordInputValue(nextValue)}
        isInputValueValid={true}/>
      <SiteFormButton
        marginTop={flexDirection === 'column' ? '0.5rem' : '0'}
        marginLeft={flexDirection === 'column' ? '0' : '0.375rem'}
        text={!['LOGGING_IN'].includes(loginStatus) ? 'Log In' : 'Logging In...'} />
    </LoginForm>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteLoginForm {
  flexDirection?: 'column' | 'row'
  isDisplayLabels?: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: ${ ({ flexDirection }: ILoginForm ) => flexDirection }; 
  justify-content: center;
  align-items: center;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`
interface ILoginForm {
  flexDirection: string
}

export default SiteLoginForm
