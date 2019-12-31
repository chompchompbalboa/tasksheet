//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenuItemInput = ({
  checkboxValue,
  setCheckboxValue,
  text = 'Input'
}: IContextMenuItemInputProps) => {
  return (
    <Container>
      <LeftPadding  />
      <Content>
        <TextContainer>
          {text}
        </TextContainer>
        <StyledInput
          type="checkbox"
          value={checkboxValue}
          onChange={e => setCheckboxValue(e.target.value)}/>
      </Content>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IContextMenuItemInputProps {
  checkboxValue: string
  setCheckboxValue(nextInputValue: string): void
  text: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  min-width: 8rem;
  width: 100%;
  padding: 0.55rem 0.75rem 0.425rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transition: background-color 0.05s;
  border-radius: 3px 3px 0 0;
  &:hover {
    background-color: rgb(242, 242, 242);
  }
`

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LeftPadding = styled.div`
margin: 0 0.5rem;
width: 0.75rem;
display: flex;
align-items: center;
justify-content: center;
`

const TextContainer = styled.span`
  margin-right: 0.25rem;
  white-space: nowrap;
`

const StyledInput = styled.input``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenuItemInput
