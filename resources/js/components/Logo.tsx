//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import * as React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Logo = ({ alignItems, fontSize }: LogoProps) => (
  <Container alignItems={alignItems}>
    <Name>
      <Build fontSize={fontSize}>
        simple
      </Build>
      <That fontSize={fontSize}>
        sheet
      </That>
    </Name>
  </Container>
  )

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface LogoProps {
  alignItems: string
  fontSize: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: ${ ({ alignItems }: ContainerProps) => alignItems };
`
interface ContainerProps {
  alignItems: string
}

const Name = styled.div`
  display: flex;
`

const Build = styled.div`
  font-size: ${ ({ fontSize }: BuildProps) => fontSize };
  font-weight: bold;
`
interface BuildProps {
  fontSize: string
}

const That = styled.div`
  font-size: ${ ({ fontSize }: ThatProps) => fontSize };
`
interface ThatProps {
  fontSize: string
}