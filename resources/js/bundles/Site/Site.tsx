//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import styled from 'styled-components'

//import { query } from '@site/api'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  const [ isLoginOrRegister, setIsLoginOrRegister ] = useState('REGISTER')
  
  const [ accessCodeInputValue, setAccessCodeInputValue ] = useState('')
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ nameInputValue, setNameInputValue ] = useState('')
  const [ passwordInputValue, setPasswordInputValue ] = useState('')
  
  const [ loginStatus, setLoginStatus ] = useState('READY')
  const handleLoginAttempt = (e: FormEvent) => {
    e.preventDefault()
    setLoginStatus('LOGGING_IN')
  }
  
  const [ registerStatus, setRegisterStatus ] = useState('READY')
  const handleRegisterAttempt = (e: FormEvent) => {
    e.preventDefault()
    setRegisterStatus('REGISTERING')
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
                placeholder="Name"
                value={nameInputValue}
                onChange={e => setNameInputValue(e.target.value)}/>
              <StyledInput
                placeholder="Email"
                value={emailInputValue}
                onChange={e => setEmailInputValue(e.target.value)}/>
              <StyledInput
                placeholder="Access Code"
                value={accessCodeInputValue}
                onChange={e => setAccessCodeInputValue(e.target.value)}/>
              <SubmitButton
                isSubmitting={registerStatus === 'REGISTERING'}>
                {registerStatus === 'READY' ? 'Sign up for early access' : 'Signing Up...'}
              </SubmitButton>
            </form>
          }
          {isLoginOrRegister === 'LOGIN' && registerStatus !== 'REGISTERED' &&
            <form onSubmit={e => handleLoginAttempt(e)}>
              <StyledInput
                placeholder="Email"
                value={emailInputValue}
                onChange={e => setEmailInputValue(e.target.value)}/>
              <StyledInput
                type="password"
                placeholder="Password"
                value={passwordInputValue}
                onChange={e => setPasswordInputValue(e.target.value)}/>
              <SubmitButton
                isSubmitting={loginStatus === 'LOGGING_IN'}>
                {loginStatus === 'READY' ? 'Login' : 'Logging In...'}
              </SubmitButton>
            </form>
          }
        </LoginRegisterContainer>
        <CurrentStatus>
          {isLoginOrRegister === 'REGISTER' &&
            <LoginLink onClick={() => handleFormVisibilityChange('LOGIN')}>Already registered? Click here to login.</LoginLink>}
          {isLoginOrRegister === 'LOGIN' &&
            <LoginLink onClick={() => handleFormVisibilityChange('REGISTER')}>Go back to registration</LoginLink>}
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
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
`

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
