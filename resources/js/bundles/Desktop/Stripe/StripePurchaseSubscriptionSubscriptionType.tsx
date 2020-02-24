//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionPurchaseSubscriptionSubscriptionType = ({
  description,
  header,
  isSelected,
  onClick,
  price
}: ISettingsUserSubscriptionPurchaseSubscriptionSubscriptionType) => {
  
  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container
      isSelected={isSelected}
      onClick={onClick}
      userColorPrimary={userColorPrimary}>
      <Header>
        {header}
      </Header>
      <Price>
        {price}
      </Price>
      <Divider />
      <Description>
        {description}
      </Description>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISettingsUserSubscriptionPurchaseSubscriptionSubscriptionType {
  description: string
  header: string
  isSelected: boolean
  onClick(): void
  price: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;
  margin-right: 0.5rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid rgb(150, 150, 150);
  background-color: ${ ({ isSelected, userColorPrimary }: IContainer) => isSelected ? userColorPrimary : 'rgb(255, 255, 255)' };
  color: ${ ({ isSelected }: IContainer) => isSelected ? 'white' : 'inherit' };
  &:hover {
    background-color: ${ ({ userColorPrimary }: IContainer) => userColorPrimary };
    color: white;
  }
`
interface IContainer {
  isSelected: boolean
  userColorPrimary: string
}

const Header = styled.div`
  padding: 0.25rem 0;
  font-size: 1.1rem;
  font-weight: bold;
`

const Divider = styled.div`
  margin: 0.75rem 0;
  width: 60%;
  height: 1px;
  background-color: rgb(150, 150, 150);
`

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
`

const Description = styled.div`
  width: 10rem;
  text-align: justify;
  margin-bottom: 0.25rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionPurchaseSubscriptionSubscriptionType
