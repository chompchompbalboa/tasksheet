//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ISiteFormSubmitButton = ({
  text
}: IISiteFormSubmitButton) => (
  <Button>
    {text}
  </Button>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IISiteFormSubmitButton {
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Button = styled.button`
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

export default ISiteFormSubmitButton
