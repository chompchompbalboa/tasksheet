//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContextMenuConfirmDelete = ({
  description = 'name'
}: ContextMenuConfirmDeleteProps) => {

  const [ inputValue, setInputValue ] = useState("")
  
  return (
    <Container>
      <AutosizeInput
        inputStyle={{
          fontSize: 'inherit',
          fontWeight: 'inherit',
          fontFamily: 'inherit',
          letterSpacing: 'inherit',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
        }}
        placeholder={"Enter " + description + " to delete"}
        onChange={(e: any) => setInputValue(e.target.value)}
        value={inputValue}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type ContextMenuConfirmDeleteProps = {
  description?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.625rem 0.625rem 0.625rem 1rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContextMenuConfirmDelete
