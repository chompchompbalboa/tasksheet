//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN } from '@/assets/icons'

import { IAppState } from '@/state'

import Icon from '@/components/Icon'
import SiteActionsChooseAction from '@desktop/Site/SiteActionsChooseAction'
import SiteActionsLogin from '@desktop/Site/SiteActionsLogin'
import SiteActionsPricing from '@desktop/Site/SiteActionsPricing'
import SiteActionsRegister from '@desktop/Site/SiteActionsRegister'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SiteSplash = () => {
  
  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // State
  const [ activeSiteAction, setActiveSiteAction ] = useState('REGISTER' as IActiveSiteAction)

  return (
    <Container
      userColorPrimary={userColorPrimary}>
      <Header>
        <HeaderName>
          task<Gray>sheet</Gray>
        </HeaderName>
        <HeaderLinks>
          <HeaderLink>30-day free trial<br/>$5 per month or $100 for lifetime access</HeaderLink>
        </HeaderLinks>
      </Header>
      <Splash>
        <LeftColumn>
          <ShortText>The spreadsheet that's perfect<br/>for your workplace to-do lists</ShortText>
          <LongText><ToDoSheet>Tasksheet</ToDoSheet> is a spreadsheet fine-tuned for task management. Built around its ability to quickly and easily organize your to-dos, it is a uniquely flexible and powerful solution for managing life at work</LongText>
          <ScrollDownToTry>
            <ScrollDownToTryIcon>
              <Icon icon={ARROW_DOWN}/>
            </ScrollDownToTryIcon>
            <ScrollDownToTryText>
              Scroll down to try it out
            </ScrollDownToTryText>
          </ScrollDownToTry>
        </LeftColumn>
        <RightColumn>
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
        </RightColumn>
      </Splash>
      <SpreadsheetIcon
        src={environment.assetUrl + 'images/spreadsheet.png'}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
export type IActiveSiteAction = 'REGISTER' | 'LOGIN' | 'PRICING'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${ ({ userColorPrimary }: IContainer) => userColorPrimary };
  color: white;
  font-family: inherit;
  overflow: hidden;
  border-bottom: 1px solid rgb(150, 150, 150);
`
interface IContainer {
  userColorPrimary: string
}

const Gray = styled.span`
  color: rgb(190, 190, 190);
`

const SpreadsheetIcon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
`

const Header = styled.div`
  z-index: 10;
  position: relative;
  width: 100%;
  padding: 3rem;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 480px) {
    padding: 1rem;
    justify-content: flex-end;
  }
`

const HeaderName = styled.div`
  font-size: 2rem;
  font-weight: bold;
  @media (max-width: 480px) {
    display: none;
  }
`

const HeaderLinks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`

const HeaderLink = styled.div`
  font-size: 0.9rem;
  line-height: 1.3rem;
  text-align: right;
  white-space: nowrap;
`

const Splash = styled.div`
  z-index: 10;
  width: 100%;
  height: calc(100% - 5.5rem);
  position: relative;
	display: flex;
  justify-content: center;
  align-items: center;
`

const ShortText = styled.div`
  width: 100%;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  @media (max-width: 480px) {
    margin-top: -10%;
  }
`

const LongText = styled.div`
  font-size: 1.125rem;
  width: 90%;
`

const Column = styled.div`
  height: 80%;
  display: flex;
  flex-direction: column;
`

const LeftColumn = styled(Column)`
  width: 45%;
  margin-right: 5%;
  align-items: flex-start;
  justify-content: center;
`

const RightColumn = styled(Column)`
  width: 35%;
  align-items: flex-start;
  justify-content: center;
`

const ActionsContainer = styled.div`
  width: 90%;
  padding: 1rem;
  color: black;
`

const Actions = styled.div`
  padding: 1.5rem;
  background-color: rgb(230, 230, 230);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`

const ScrollDownToTry = styled.div`
  position: absolute;
  bottom: 5rem;
  align-self: flex-start;
  display: flex;
`

const ScrollDownToTryText = styled.div`
  margin-left: 0.5rem;
  font-size: 0.8rem;
`

const ScrollDownToTryIcon = styled.div``

const ToDoSheet = styled.span`
  font-weight: bold;
  white-space: nowrap;
`

export default SiteSplash
