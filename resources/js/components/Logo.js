//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { string } from 'prop-types'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Logo = ({ 
  alignItems, 
  fontSize, 
}) => {
  return (
    <Container
      alignItems={alignItems}>
      <Name>
        <Build
          fontSize={fontSize}>
          simple
        </Build>
        <That
          fontSize={fontSize}>
          sheet
        </That>
      </Name>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
Logo.propTypes = {
  alignItems: string,
  fontSize: string,
}

Logo.defaultProps = {
  alignItems: 'center',
  fontSize: '3em',
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: ${ props => props.alignItems };
`

const Name = styled.div`
  display: flex;
`

const Build = styled.div`
  font-size: ${ props => props.fontSize };
  font-weight: bold;
`

const That = styled.div`
  font-size: ${ props => props.fontSize };
`

export default Logo