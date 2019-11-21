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
        action.userRegister(emailInputValue, passwordInputValue).then(
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
      <Header>
        <HeaderName>
          sortsheet
        </HeaderName>
        <HeaderLinks>
          <HeaderLink>30 day free trial.<br/>$5 per month or $100 for lifetime access.</HeaderLink>
        </HeaderLinks>
      </Header>
      <Splash>
        <Name>sortsheet</Name>
        <Motto>The spreadsheet that makes it easy to organize your data</Motto>
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
              <SubmitButton>
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
              <SubmitButton>
                {!['LOGGING_IN'].includes(loginStatus) ? 'Log In' : 'Logging In...'}
              </SubmitButton>
            </LoginRegisterForm>
          }
        </LoginRegisterContainer>
        <CurrentStatus>
          {isLoginOrRegister === 'REGISTER' &&
            <LoginLink onClick={() => handleFormVisibilityChange('LOGIN')}>
              {registerStatus !== 'ERROR' 
                ? 'Click here to log in'
                : 'There was a problem registering, please try again or click here to login instead'}
            </LoginLink>}
          {isLoginOrRegister === 'LOGIN' &&
            <LoginLink onClick={() => handleFormVisibilityChange('REGISTER')}>
              {loginStatus !== 'ERROR' 
                ? 'Click here to sign up'
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
  position: absolute;
  z-index: 10000;
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
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 480px) {
    justify-content: flex-end;
  }
`

const HeaderName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  @media (max-width: 480px) {
    display: none;
  }
`

const HeaderLinks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`

const HeaderLink = styled.div`
  text-align: right;
  white-space: nowrap;
`

const Splash = styled.div`
  margin-top: 2rem;
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
  width: 80%;
  text-align: center;
`

const CurrentStatus = styled.div`
  font-size: 0.8rem;
  text-align: center;
`

const LoginLink = styled.span`
  cursor: pointer;
  transition: text-decoration 0.1s;
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
  background-color: rgba(220, 220, 220, 1);
  color: black;
  outline: none;
  transition: background-color 0.1s;
  &:hover {
    background-color: white;
    color: black;
  }
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.375rem;
  }
`

export default SiteSplash
