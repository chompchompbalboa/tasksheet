//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import { IFolderUser } from '@/state/folder/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesUsersUser = ({
  user
}: IFoldersPropertiesUsersUser) => {  
  return (
    <Container>
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
      <Actions>
        <Role>{user.role}</Role>
        <Delete><Icon icon={CLOSE} size="0.75rem"/></Delete>
      </Actions>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesUsersUser {
  user: IFolderUser
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`

const Name = styled.div`
  width: 33%;
`

const Email = styled.div`
  width: 33%;
  text-align: center;
`

const Actions = styled.div`
  width: 33%;
  display: flex;
  justify-content: flex-end;
`

const Role = styled.div``

const Delete = styled.div`
  cursor: pointer;
  padding: 0.125rem;
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-color: rgb(225, 225, 225);
  opacity: 0.8;
  &:hover {
    opacity: 1;
    background-color: rgb(225, 0, 0);
    color: white;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesUsersUser
