//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { ARROW_RIGHT } from '@app/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFeaturesButton = ({
  onClick,
  text = 'Get started now'
}: ISiteFeaturesButton) => {
  
  return (
    <Container>
      <ButtonContainer
        onClick={onClick}>
        <TextContainer>
          {text}
        </TextContainer>
        <IconContainer>
          <Icon 
            icon={ARROW_RIGHT}/>
        </IconContainer>
      </ButtonContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISiteFeaturesButton {
  text?: string
  onClick?(...args: any): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 480px) {
    justify-content: center;
  }
`

const ButtonContainer = styled.div`
  cursor: pointer;
  margin: 1rem 0;
  max-width: 13rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  background-color: rgb(1, 21, 65);
  color: white;
  border-radius: 0.5rem;
  @media (max-width: 480px) {
    margin: 1.5rem 0 0.5rem 0;
    max-width: 75%;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
  }
`

const TextContainer = styled.div`
  margin-right: 1.25rem;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export default SiteFeaturesButton
