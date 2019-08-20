//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Site = () => {
  
  const [ emailInputValue, setEmailInputValue ] = useState('')
  const [ nameInputValue, setNameInputValue ] = useState('')
  
  return (
    <Container>
      <Header>tracksheet</Header>
      <Content>
        <Name>tracksheet</Name>
        <Motto>The spreadsheet built for keeping track of anything and everything</Motto>
        <LoginRegisterContainer>
          <StyledInput
            placeholder="Name"
            value={nameInputValue}
            onChange={e => setNameInputValue(e.target.value)}/>
          <StyledInput
            placeholder="Email"
            value={emailInputValue}
            onChange={e => setEmailInputValue(e.target.value)}/>
          <SubmitButton>
            Sign up for early access
          </SubmitButton>
        </LoginRegisterContainer>
        <CurrentStatus>
          We're still building tracksheet. Enter in your details and we'll be in touch soon.<br/>
          Already registered? <LoginLink>Click here to login.</LoginLink>
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
  margin-bottom: 2rem;
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
  margin-bottom: 0.5rem;
`

const StyledInput = styled.input`
  margin: 0 0.375rem;
  padding: 0.5rem 0.25rem;
  border: none;
  border-radius: 4px;
  outline: none;
`

const SubmitButton = styled.div`
  margin-left: 0.375rem;
  cursor: pointer;
  padding: 0.25rem 1rem;
  border: 1px solid white;
  border-radius: 4px;
  &:hover {
    background-color: white;
    color: #088E72;
  }
`

export default Site
