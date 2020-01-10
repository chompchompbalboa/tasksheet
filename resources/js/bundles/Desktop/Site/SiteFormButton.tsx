//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ISiteFormSubmitButton = ({
  borderColor = 'rgb(150, 150, 150)',
  marginLeft = '0.375rem',
  marginTop = '0',
  text
}: IISiteFormSubmitButton) => (
  <Button
    marginLeft={marginLeft}
    marginTop={marginTop}
    borderColor={borderColor}>
    {text}
  </Button>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IISiteFormSubmitButton {
  borderColor?: string
  marginLeft?: string
  marginTop?: string
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Button = styled.button`
  width: 100%;
  margin-top: ${ ({ marginTop }: IButton ) => marginTop };
  margin-left: ${ ({ marginLeft }: IButton ) => marginLeft };
  cursor: pointer;
  padding: 0.5rem 1.25rem;
  border: 1px solid ${ ({ borderColor }: IButton ) => borderColor };
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

interface IButton {
  borderColor: string
  marginLeft: string
  marginTop: string
}

export default ISiteFormSubmitButton
