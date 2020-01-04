//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { Component } from 'react'
import styled from 'styled-components'

import { ERROR } from '@/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export default class ErrorBoundary extends Component {

  state = {
    hasError: false
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    const { className, children }: IErrorBoundary = this.props
    const { hasError } = this.state

    return (
      <Container
        className={className}>
        {hasError
          ? <ErrorContainer>
              <ErrorIconContainer>
                <Icon
                  icon={ERROR}
                  size="4rem"/>
              </ErrorIconContainer>
              <ErrorMessage>
                Something has gone wrong. Please refresh the page.<br/><br/>
                If you continue to see this error, please send me an email at <a href="mailto: rocky@tasksheet.app">rocky@tasksheet.app</a>.
              </ErrorMessage>
            </ErrorContainer>
          : children
        }
      </Container>
    )
  }
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IErrorBoundary {
  className?: string
  children?: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  color: rgb(50, 50, 50);
`

const ErrorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ErrorIconContainer = styled.div`
  margin-bottom: 1.5rem;
  color: rgb(120, 120, 120);
`

const ErrorMessage = styled.div`
  width: 30%;
  text-align: center;
  font-size: 0.9rem;
  @media(max-width: 480px) {
    width: 80%;
  }
`