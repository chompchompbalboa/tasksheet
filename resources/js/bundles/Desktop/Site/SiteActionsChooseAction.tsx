//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { IActiveSiteAction } from '@desktop/Site/SiteActions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteActionsChooseAction = ({
  activeSiteAction,
  setActiveSiteAction
}: ISiteActionsChooseAction) => {
  return (
    <Container>
      <ActionLink
        isActiveSiteAction={activeSiteAction === 'REGISTER'}
        onClick={() => setActiveSiteAction('REGISTER')}>
        Register
      </ActionLink>
      <ActionLinkDivider />
      <ActionLink
        isActiveSiteAction={activeSiteAction === 'LOGIN'}
        onClick={() => setActiveSiteAction('LOGIN')}>
        Login
      </ActionLink>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteActionsChooseAction {
  activeSiteAction: IActiveSiteAction,
  setActiveSiteAction(nextActiveSiteAction: IActiveSiteAction): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgb(250, 250, 250);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`

const ActionLink = styled.div`
  cursor: pointer;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: ${ ({ isActiveSiteAction }: IActionLink ) => isActiveSiteAction ? 'underline' : 'none' };
  &:hover {
    text-decoration: underline;
  }
`
interface IActionLink {
  isActiveSiteAction: boolean
}

const ActionLinkDivider = styled.div`
  height: 1rem;
  width: 1px;
  background-color: black;
`

export default SiteActionsChooseAction
