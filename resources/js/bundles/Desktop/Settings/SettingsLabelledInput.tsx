//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsLabelledInput = ({
  label,
  onBlur,
  onChange,
  value,
  width = '100%'
}: ISettingsLabelledInput) => {

  return (
    <Container
      containerWidth={width}>
      <Label>{label}</Label>
      <StyledInput
        value={value}
        onBlur={onBlur}
        onChange={e => onChange(e.target.value)}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsLabelledInput {
  label: string
  onBlur?(): void
  onChange(nextValue: string): void
  value: string
  width?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.125rem;
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  display: flex;
  justify-content: space-between;
  align-items: center;  
  color: rgb(50, 50, 50);
  border-bottom: 1px dashed rgb(200, 200, 200);
`
interface IContainer {
  containerWidth: string
}

const Label = styled.div`
  display: inline;
  font-weight: bold;
  font-size: 0.85rem;
`

const StyledInput = styled.input`
  width: 100%;
  text-align: right;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 0.8rem;
`

export default SettingsLabelledInput
