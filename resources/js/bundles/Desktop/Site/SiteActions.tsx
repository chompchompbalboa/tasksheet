//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SiteActionsChooseAction from '@desktop/Site/SiteActionsChooseAction'
import SiteActionsHeader from '@desktop/Site/SiteActionsHeader'
import SiteActionsLogin from '@desktop/Site/SiteActionsLogin'
import SiteActionsPricing from '@desktop/Site/SiteActionsPricing'
import SiteActionsRegister from '@desktop/Site/SiteActionsRegister'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteActions = ({
  dockSiteActions,
  isSiteActionsDocked
}: ISiteActions) => {

  // Refs
  const container = useRef(null)
  
  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ activeSiteAction, setActiveSiteAction ] = useState('REGISTER' as IActiveSiteAction)

  // Effects
  useEffect(() => {
    if(isSiteActionsDocked) {
      removeEventListener('mousedown', closeContainerOnClickOutside)
    }
    else {
      addEventListener('mousedown', closeContainerOnClickOutside)
    }
    return () => removeEventListener('mousedown', closeContainerOnClickOutside)
  }, [ isSiteActionsDocked ])

  // Close Container On Click Outside
  const closeContainerOnClickOutside = (e: MouseEvent) => {
    if(!container.current.contains(e.target)) {
      dockSiteActions()
    }
  }
  
  return (
    <Container
      ref={container}
      isSiteActionsDocked={isSiteActionsDocked}
      userColorPrimary={userColorPrimary}>
      <SiteActionsHeader
        dockSiteActions={dockSiteActions}/>
      <ActionsContainer>
        <SiteActionsChooseAction
          activeSiteAction={activeSiteAction}
          setActiveSiteAction={setActiveSiteAction}/>
        <Actions>
          {activeSiteAction === 'REGISTER' && <SiteActionsRegister />}
          {activeSiteAction === 'LOGIN' && <SiteActionsLogin />}
          {activeSiteAction === 'PRICING' && <SiteActionsPricing />}
        </Actions>
      </ActionsContainer>
    </Container>
  )
}
//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISiteActions {
  dockSiteActions(): void
  isSiteActionsDocked: boolean
}

export type IActiveSiteAction = 'REGISTER' | 'LOGIN' | 'PRICING'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 500;
  position: fixed;
  width: 30vw;
  height: 100vh;
  top: 0;
  left: ${ ({ isSiteActionsDocked }: IContainer) => isSiteActionsDocked ? '100vw' : '70vw' };
  transition: left 0.25s;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background-color: ${ ({ userColorPrimary }: IContainer) => userColorPrimary };
  color: white;
  border-left: 1px solid rgb(150, 150, 150);
  box-shadow: ${ ({ isSiteActionsDocked }: IContainer) => isSiteActionsDocked ? 'none' : '-3px 0px 20px -2px rgba(0,0,0,0.75)' };
`
interface IContainer {
  isSiteActionsDocked: boolean
  userColorPrimary: string
}

const ActionsContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  padding: 1rem;
  color: black;
  display: flex;
  flex-direction: column;
`

const Actions = styled.div`
  flex-grow: 1;
  height: 100%;
  padding: 1.5rem;
  background-color: rgb(230, 230, 230);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`

export default SiteActions
