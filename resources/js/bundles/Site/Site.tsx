//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import styled from 'styled-components'
import { isEmail } from 'validator'

import { action } from '@app/api'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  const [ isLoginOrRegister, setIsLoginOrRegister ] = useState('LOGIN')
  
  const [ activeInput, setActiveInput ] = useState(null)
  const [ accessCodeInputValue, setAccessCodeInputValue ] = useState('')
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  
  const [ loginStatus, setLoginStatus ] = useState('READY')
  const handleLoginAttempt = (e: FormEvent) => {
    e.preventDefault()
    if(isEmail(emailInputValue)) {
      setLoginStatus('LOGGING_IN')
      try {
        action.userLogin(emailInputValue, passwordInputValue).then(
          success => {
            if(success) { window.location = window.location.href + 'app' as any }
            else { setLoginStatus('ERROR') }
          },
          err => { setLoginStatus('ERROR') }
        )
      }
      catch(e) {
        setLoginStatus('ERROR')
      }
    }
  }
  
  const [ registerStatus, setRegisterStatus ] = useState('READY')
  const handleRegisterAttempt = (e: FormEvent) => {
    e.preventDefault()
    if(isEmail(emailInputValue)) {
      setRegisterStatus('REGISTERING')
      try {
        action.userRegister(emailInputValue, passwordInputValue, accessCodeInputValue).then(
          success => {
            if(success) { window.location = window.location.href + 'app' as any }
            else { setRegisterStatus('ERROR') }
          },
          err => { setRegisterStatus('ERROR') }
        )
      }
      catch(e) {
        setRegisterStatus('ERROR')
      }
    }
  }
  
  const handleFormVisibilityChange = (nextForm: 'LOGIN' | 'REGISTER') => {
    if (nextForm === 'LOGIN') {
      setIsLoginOrRegister('LOGIN')
    }
    if (nextForm === 'REGISTER') {
      setIsLoginOrRegister('REGISTER')
    }
  }
  
  return (
    <Container>
      <Header>tracksheet</Header>
      <Content>
        <Name>tracksheet</Name>
        <Motto>The spreadsheet built for keeping track of anything and everything</Motto>
        <Divider />
        <LoginRegisterContainer>
          {isLoginOrRegister === 'REGISTER' && registerStatus !== 'REGISTERED' &&
            <form onSubmit={e => handleRegisterAttempt(e)}>
              <StyledInput
                placeholder="Email"
                value={emailInputValue}
                onChange={e => setEmailInputValue(e.target.value)}
                onFocus={() => setActiveInput('REGISTER_EMAIL')}
                onBlur={() => setActiveInput(null)}
                isInputValueValid={activeInput === 'REGISTER_EMAIL' || emailInputValue === '' || isEmail(emailInputValue)}/>
              <StyledInput
                type="password"
                placeholder="Password"
                value={passwordInputValue}
                onChange={e => setPasswordInputValue(e.target.value)}
                isInputValueValid={true}/>
              <StyledInput
                placeholder="Access Code"
                value={accessCodeInputValue}
                onChange={e => setAccessCodeInputValue(e.target.value)}
                isInputValueValid={true}/>
              <SubmitButton
                isSubmitting={registerStatus === 'REGISTERING'}>
                {!['REGISTERING'].includes(registerStatus) ? 'Sign Up' : 'Signing Up...'}
              </SubmitButton>
            </form>
          }
          {isLoginOrRegister === 'LOGIN' && registerStatus !== 'REGISTERED' &&
            <form onSubmit={e => handleLoginAttempt(e)}>
              <StyledInput
                placeholder="Email"
                value={emailInputValue}
                onChange={e => setEmailInputValue(e.target.value)}
                onFocus={() => setActiveInput('LOGIN_EMAIL')}
                onBlur={() => setActiveInput(null)}
                isInputValueValid={activeInput === 'LOGIN_EMAIL' || emailInputValue === '' || isEmail(emailInputValue)}/>
              <StyledInput
                type="password"
                placeholder="Password"
                value={passwordInputValue}
                onChange={e => setPasswordInputValue(e.target.value)}
                isInputValueValid={true}/>
              <SubmitButton
                isSubmitting={loginStatus === 'LOGGING_IN'}>
                {!['LOGGING_IN'].includes(loginStatus) ? 'Login' : 'Logging In...'}
              </SubmitButton>
            </form>
          }
        </LoginRegisterContainer>
        <CurrentStatus>
          {isLoginOrRegister === 'REGISTER' &&
            <LoginLink onClick={() => handleFormVisibilityChange('LOGIN')}>
              {registerStatus !== 'ERROR' 
                ? 'Already registered? Click here to login'
                : 'There was a problem registering, please try again or click here to login instead'}
            </LoginLink>}
          {isLoginOrRegister === 'LOGIN' &&
            <LoginLink onClick={() => handleFormVisibilityChange('REGISTER')}>
              {loginStatus !== 'ERROR' 
                ? 'Have an access code? Click here to sign up'
                : 'There was a problem logging in, please try again or click here to register instead'}
          </LoginLink>}
        </CurrentStatus>
      </Content>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
  flex-direction: column;
  background-color: #088E72;
  color: white;
`

const Header = styled.div`
  width: 100%;
  padding: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
`

const Content = styled.div`
  height: calc(100% - 5.5rem);
  width: 100%;
	display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Name = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const Motto = styled.div`
  font-size: 1.25rem;
`

const CurrentStatus = styled.div`
  font-size: 0.8rem;
  text-align: center;
`

const LoginLink = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const LoginRegisterContainer = styled.div`
	display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`

const Divider = styled.div`
  margin: 2rem 0;
  width: 10rem;
  height: 1px;
  background-color: white;
`

const StyledInput = styled.input`
  margin: 0 0.375rem;
  padding: 0.5rem 0.25rem;
  border: none;
  border: ${ ({ isInputValueValid }: StyledInputProps ) => isInputValueValid ? '2px solid transparent' : '2px solid red'};
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
`
interface StyledInputProps {
  isInputValueValid: boolean
}

const SubmitButton = styled.button`
  margin-left: 0.375rem;
  cursor: pointer;
  padding: 0.25rem 1rem;
  border: 1px solid white;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${ ({ isSubmitting }: SubmitButtonProps ) => isSubmitting ? 'white' : '#088E72'};
  color: ${ ({ isSubmitting }: SubmitButtonProps ) => isSubmitting ? 'black' : 'white'};
  outline: none;
  &:hover {
    background-color: white;
    color: black;
  }
`
interface SubmitButtonProps {
  isSubmitting: boolean
}

export default Site
