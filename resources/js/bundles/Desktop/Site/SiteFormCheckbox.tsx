//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFormCheckbox = ({
  checked,
  label = null,
  onChange
}: ISiteFormCheckbox) => {

  return (
    <Container>
      <StyledInput
        id="SiteFormCheckbox"
        type="checkbox"
        onChange={e => onChange(e.target.checked)}
        checked={checked}/>
        <Label
          htmlFor="SiteFormCheckbox">
          {label}
        </Label>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteFormCheckbox {
  checked: boolean
  label: string
  onChange(nextValue: boolean): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0.25rem 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const Label = styled.label`
  margin-left: 0.5rem;
  width: 100%;
`

const StyledInput = styled.input`
  margin: 0.375rem;
  margin-left: 0;
  padding: 0.5rem 0.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
  @media (max-width: 480px) {
    width: 100%;
    margin: 0.375rem 0;
  }
`

export default SiteFormCheckbox
