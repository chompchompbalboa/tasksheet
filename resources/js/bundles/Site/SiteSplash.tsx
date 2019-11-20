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
const SiteSplash = ({
  isLoginOrRegister,
  setIsLoginOrRegister
}: ISiteSplash) => {
  
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
    <Container
      className="site_splash_image">
      <Header>sortsheet</Header>
      <Splash>
        <Name>sortsheet</Name>
        <Motto>The spreadsheet that makes it easy to organize anything and everything</Motto>
        <Divider />
        <LoginRegisterContainer>
          {isLoginOrRegister === 'REGISTER' && registerStatus !== 'REGISTERED' &&
            <LoginRegisterForm onSubmit={e => handleRegisterAttempt(e)}>
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
            </LoginRegisterForm>
          }
          {isLoginOrRegister === 'LOGIN' && registerStatus !== 'REGISTERED' &&
            <LoginRegisterForm onSubmit={e => handleLoginAttempt(e)}>
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
                {!['LOGGING_IN'].includes(loginStatus) ? 'Log In' : 'Logging In...'}
              </SubmitButton>
            </LoginRegisterForm>
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
      </Splash>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISiteSplash {
  isLoginOrRegister: 'LOGIN' | 'REGISTER'
  setIsLoginOrRegister(nextLoginOrRegister: 'LOGIN' | 'REGISTER'): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
	width: 100%;
	height: 100vh;
	display: flex;
  flex-direction: column;
  color: white;
`

const Header = styled.div`
  padding: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: flex-start;
`

const Splash = styled.div`
  height: calc(100% - 5.5rem);
	display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Name = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-top: 10%;
  margin-bottom: 0.625rem;
  display: flex;
  align-items: flex-start;
  @media (max-width: 480px) {
    margin-top: -10%;
  }
`

const Motto = styled.div`
  font-size: 1.125rem;
  opacity: 0.85;
  width: 80%;
  text-align: center;
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
  @media (max-width: 480px) {
    width: 80%;
  }
`

const LoginRegisterForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 480px) {
    flex-direction: column;
  }
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
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.375rem 0;
  }
`
interface StyledInputProps {
  isInputValueValid: boolean
}

const SubmitButton = styled.button`
  margin-left: 0.375rem;
  cursor: pointer;
  padding: 0.5rem 1.25rem;
  border: 1px solid white;
  border-radius: 5px;
  font-size: 0.9rem;
  background-color: ${ ({ isSubmitting }: SubmitButtonProps ) => isSubmitting ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  color: ${ ({ isSubmitting }: SubmitButtonProps ) => isSubmitting ? 'rgb(25, 25, 25)' : 'rgb(25, 25, 25)'};
  outline: none;
  &:hover {
    background-color: white;
    color: black;
  }
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.375rem;
  }
`
interface SubmitButtonProps {
  isSubmitting: boolean
}

export default SiteSplash
