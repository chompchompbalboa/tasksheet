//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'
import { IOrganization } from '@app/state/organizations/types'

import { TRASH_CAN } from '@app/assets/icons'

import Icon from '@/components/Icon'
import SettingsList from '@app/bundles/Settings/SettingsList'
import SettingsListItem from '@app/bundles/Settings/SettingsListItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsOrganizationUsers = ({
  organization
}: ISettingsOrganizationUsers) => {

  return (
    <Container>
      <SettingsList
        name="Users"
        width="30%">
        {organization.users && organization.users.map((user, index) => (
          <SettingsListItem
            key={user.id}>
            <User
              isFirst={index === 0}>
              <UserName>{user.name}</UserName>
              <UserActions>
                <DeleteUserFromOrganization>
                  <Icon
                    icon={TRASH_CAN}
                    size="0.8rem"/>
                </DeleteUserFromOrganization>
            </UserActions>
            </User>
          </SettingsListItem>
        ))}
        <AddUser>
          Add User...
        </AddUser>
      </SettingsList>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISettingsOrganizationUsers {
  organization: IOrganization
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const User = styled.div`
  cursor: default;
  padding: 0.25rem 0.125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: ${ ({ isFirst }: IUser ) => isFirst ? '1px dashed rgb(200, 200, 200)' : 'none' };
  border-bottom: 1px dashed rgb(200, 200, 200);
  &:hover {
    background-color: rgb(225, 225, 225);
  }
`
interface IUser {
  isFirst: boolean
}

const UserName = styled.div``

const UserActions = styled.div``

const DeleteUserFromOrganization = styled.div`
  cursor: pointer;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`

const AddUser = styled.div`
  cursor: pointer;
  padding: 0.25rem 0.125rem;
  border-bottom: 1px dashed rgb(200, 200, 200);
  &:hover {
    background-color: rgb(225, 225, 225);
  }
`

export default SettingsOrganizationUsers
