//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { IFolder } from '@/state/folder/types'

import FoldersPropertiesUsersUser from '@desktop/Folders/FoldersPropertiesUsersUser'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesUsers = ({
  users
}: IFoldersPropertiesUsers) => {  
  return (
    <Container>
      {users && users.map((user, index) => (
        <FoldersPropertiesUsersUser
          key={index}
          user={user}/>
      ))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesUsers {
  users: IFolder['users']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesUsers
