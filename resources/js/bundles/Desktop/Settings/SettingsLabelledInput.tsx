//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsLabelledInput = ({
  disabled = false,
  inputType = "text",
  label,
  onBlur,
  onChange,
  status = '',
  statusColor = 'inherit',
  statusContainerTestId = 'SettingsLabelledInputStatusContainer',
  value,
  width = '100%'
}: ISettingsLabelledInput) => {

  return (
    <Container>
      <InputContainer
        containerWidth={width}>
        <Label>
          <LabelText>{label}</LabelText>
          <StyledInput
            type={inputType}
            disabled={disabled}
            value={value}
            onBlur={onBlur}
            onChange={e => onChange(e.target.value)}/>
        </Label>
      </InputContainer>
      <StatusContainer
        data-testid={statusContainerTestId}
        statusColor={statusColor}>
        {status}
      </StatusContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsLabelledInput {
  disabled?: boolean
  label: string
  inputType?: "text" | "password"
  onBlur?(): void
  onChange(nextValue: string): void
  status?: string
  statusColor?: string
  statusContainerTestId?: string
  value: string
  width?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
  
const InputContainer = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.125rem;
  width: ${ ({ containerWidth }: IInputContainer ) => containerWidth };
  display: flex;
  justify-content: space-between;
  align-items: center;  
  color: rgb(50, 50, 50);
  border-bottom: 1px dashed rgb(200, 200, 200);
`
interface IInputContainer {
  containerWidth: string
}

const Label = styled.label`
  width: 100%;
  display: flex;
`

const LabelText = styled.span`
  font-weight: bold;
  font-size: 0.85rem;
  white-space: nowrap;
`

const StyledInput = styled.input`
  width: 100%;
  text-align: right;
  border: none;
  outline: none;
  background-color: transparent;
  font-family: inherit;
  font-size: 0.8rem;
  color: rgb(50, 50, 50);
`

const StatusContainer = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.125rem;
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
  color: ${ ({ statusColor }: IStatusContainer ) => statusColor };
`
interface IStatusContainer {
  statusColor: string;
}

export default SettingsLabelledInput
