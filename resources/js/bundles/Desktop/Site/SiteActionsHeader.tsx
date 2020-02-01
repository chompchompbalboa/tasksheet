//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteActionsHeader = ({
  dockSiteActions
}: ISiteActionsHeader) => {
  return (
    <Container>
      <Name>todo<Gray>sheet</Gray></Name>
      <CloseSiteActions
        onClick={() => dockSiteActions()}>
        <Icon 
          size="1.5rem"
          icon={CLOSE}/>
      </CloseSiteActions>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteActionsHeader {
  dockSiteActions(): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Gray = styled.span`
  color: rgb(175, 175, 175);
`

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: auto;
`

const CloseSiteActions = styled.div`
  cursor: pointer;
  position: relative;
  top: -0.75rem;
  left: 2rem;
`

export default SiteActionsHeader
