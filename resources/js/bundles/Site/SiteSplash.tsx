//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { isEmail } from 'validator'

import { action } from '@app/api'

import { IAppState } from '@app/state'
import {
  updateActiveSiteSplashForm,
  updateActiveSiteSplashFormMessage
} from '@app/state/active/actions'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteSplash = () => {
  
  const dispatch = useDispatch()
  const activeSheetId = useSelector((state: IAppState) => {
    if(state.tab.activeTab && state.folder.files[state.tab.activeTab]) {
      return state.folder.files[state.tab.activeTab].typeId
    }
    return null
  })
  const activeSiteSplashForm = useSelector((state: IAppState) => state.active.SITE_SPLASH_FORM)
  const activeSiteSplashFormMessage = useSelector((state: IAppState) => state.active.SITE_SPLASH_FORM_MESSAGE)
  
  const [ activeInput, setActiveInput ] = useState(null)
  const [ nameInputValue, setNameInputValue ] = useState('')
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
            if(success) { window.location = window.location.href as any}
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
      action.userRegister(nameInputValue, emailInputValue, passwordInputValue).then(
        response => {
          if(response.status === 200) {
            window.location = window.location.href as any
          }
          else {
            dispatch(updateActiveSiteSplashFormMessage('ERROR_DURING_REGISTRATION'))
            setRegisterStatus('ERROR')
          }
      })
    }
  }
  
  const handleInputBlur = () => {
    if(activeSheetId) {
      dispatch(allowSelectedCellEditing(activeSheetId))
      dispatch(allowSelectedCellNavigation(activeSheetId))
    }
  }
  
  const handleInputFocus = () => {
    if(activeSheetId) {
      dispatch(preventSelectedCellEditing(activeSheetId))
      dispatch(preventSelectedCellNavigation(activeSheetId))
    }
  }

  const siteSplashFormMessages = {
    ACCOUNT_NEEDED_TO_CREATE_SHEET: 
      <>
        You need to create an account or sign in to an existing account to create a new sheet.
        <br/>
        If you have an exisiting account, click here to login.
      </>,
    ACCOUNT_NEEDED_TO_UPLOAD_CSV: 
      <>
        You need to create an account or sign in to an existing account to upload a .csv file.
        <br/>
        If you have an exisiting account, click here to login.
      </>,
    CLICK_TO_LOGIN_INSTEAD: 'Click here to login',
    CLICK_TO_REGISTER_INSTEAD: 'Click here to sign up',
    ERROR_DURING_REGISTRATION: 
      <>
        We were unable to create your account.
        <br/>
        Please verify that you have correctly entered your name, email address and password and try again.
      </>
  }
  
  return (
    <Container>
      <Header>
        <HeaderName>
          tasksheet
        </HeaderName>
        <HeaderLinks>
          <HeaderLink>30 day free trial<br/>$5 per month or $100 for lifetime access</HeaderLink>
        </HeaderLinks>
      </Header>
      <Splash>
        <Name>tasksheet</Name>
        <Motto>The spreadsheet built for keeping track of your team's to-dos</Motto>
        <Divider />
        <LoginRegisterContainer>
          {activeSiteSplashForm === 'REGISTER' &&
            <LoginRegisterForm onSubmit={e => handleRegisterAttempt(e)}>
              <StyledInput
                placeholder="Name"
                value={nameInputValue}
                onBlur={() =>  handleInputBlur()}
                onChange={e => setNameInputValue(e.target.value)}
                onFocus={() =>  handleInputFocus()}
                isInputValueValid={true}/>
              <StyledInput
                placeholder="Email"
                value={emailInputValue}
                onChange={e => setEmailInputValue(e.target.value)}
                onFocus={() => {
                  handleInputFocus()
                  setActiveInput('REGISTER_EMAIL')
                }}
                onBlur={() => {
                  handleInputBlur()
                  setActiveInput(null)
                }}
                isInputValueValid={activeInput === 'REGISTER_EMAIL' || emailInputValue === '' || isEmail(emailInputValue)}/>
              <StyledInput
                type="password"
                placeholder="Password"
                value={passwordInputValue}
                onBlur={() =>  handleInputBlur()}
                onChange={e => setPasswordInputValue(e.target.value)}
                onFocus={() =>  handleInputFocus()}
                isInputValueValid={true}/>
              <SubmitButton>
                {!['REGISTERING'].includes(registerStatus) ? 'Sign Up' : 'Sending...'}
              </SubmitButton>
            </LoginRegisterForm>
          }
          {activeSiteSplashForm === 'LOGIN' &&
            <LoginRegisterForm onSubmit={e => handleLoginAttempt(e)}>
              <StyledInput
                placeholder="Email"
                value={emailInputValue}
                onChange={e => setEmailInputValue(e.target.value)}
                onFocus={() => {
                  handleInputFocus()
                  setActiveInput('LOGIN_EMAIL')
                }}
                onBlur={() => {
                  handleInputBlur()
                  setActiveInput(null)
                }}
                isInputValueValid={activeInput === 'LOGIN_EMAIL' || emailInputValue === '' || isEmail(emailInputValue)}/>
              <StyledInput
                type="password"
                placeholder="Password"
                value={passwordInputValue}
                onBlur={() =>  handleInputBlur()}
                onChange={e => setPasswordInputValue(e.target.value)}
                onFocus={() =>  handleInputFocus()}
                isInputValueValid={true}/>
              <SubmitButton>
                {!['LOGGING_IN'].includes(loginStatus) ? 'Log In' : 'Logging In...'}
              </SubmitButton>
            </LoginRegisterForm>
          }
        </LoginRegisterContainer>
        <CurrentStatus>
          <CurrentStatusLink
            onClick={activeSiteSplashForm === 'LOGIN' 
              ? () => {
                  dispatch(updateActiveSiteSplashForm('REGISTER'))
                  dispatch(updateActiveSiteSplashFormMessage('CLICK_TO_LOGIN_INSTEAD'))}
              : () => {
                  dispatch(updateActiveSiteSplashForm('LOGIN'))
                  dispatch(updateActiveSiteSplashFormMessage('CLICK_TO_REGISTER_INSTEAD'))}
              }>
            {siteSplashFormMessages[activeSiteSplashFormMessage]}
          </CurrentStatusLink>
        </CurrentStatus>
      </Splash>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: absolute;
  top: 100vh;
  z-index: 100;
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
    padding: 1rem;
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
  font-size: 0.9rem;
  line-height: 1.3rem;
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
  font-size: 0.85rem;
  line-height: 1.25rem;
  text-align: center;
`

const CurrentStatusLink = styled.span`
  cursor: pointer;
  transition: text-decoration 0.1s;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 480px) {
    max-width: 90%;
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
