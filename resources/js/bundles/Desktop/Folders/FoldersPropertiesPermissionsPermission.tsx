//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import { IAppState } from '@/state'
import { IFolderPermission } from '@/state/folder/types'

import Icon from '@/components/Icon'
import FoldersPropertiesPermissionsPermissionRoles from '@desktop/Folders/FoldersPropertiesPermissionsPermissionRoles'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesPermissionsPermission = ({
  folderPermissionId
}: IFoldersPropertiesPermissionsPermission) => {
  
  const folderPermission = useSelector((state: IAppState) => state.folder.allFolderPermissions && state.folder.allFolderPermissions[folderPermissionId])

  return (
    <Container>
      {folderPermission &&
        <>
          <Name>{folderPermission.userName}</Name>
          <Email>{folderPermission.userEmail}</Email>
          <Actions>
            <FoldersPropertiesPermissionsPermissionRoles
              activeRole={folderPermission.role}/>
            <Delete><Icon icon={CLOSE} size="0.7rem"/></Delete>
          </Actions>
        </>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesPermissionsPermission {
  folderPermissionId: IFolderPermission['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.125rem 0;
  font-size: 0.9rem;
  border-bottom: 1px dashed rgb(175, 175, 175);
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

const Delete = styled.div`
  cursor: pointer;
  padding: 0.0625rem;
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
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
export default FoldersPropertiesPermissionsPermission
