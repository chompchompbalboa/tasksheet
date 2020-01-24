//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IFolderPermission } from '@/state/folder/types'

import { 
  deleteFolderPermission,
  updateFolderPermission
} from '@/state/folder/actions'

import Icon from '@/components/Icon'
import FoldersPropertiesPermissionsPermissionRoles from '@desktop/Folders/FoldersPropertiesPermissionsPermissionRoles'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesPermissionsPermission = ({
  folderPermissionId
}: IFoldersPropertiesPermissionsPermission) => {
  
  // Redux
  const dispatch = useDispatch()
  const folderPermission = useSelector((state: IAppState) => state.folder.allFolderPermissions && state.folder.allFolderPermissions[folderPermissionId])
  const userId = useSelector((state: IAppState) => state.user.id)

  // State
  const [ deleteFolderPermissionStatus, setDeleteFolderPermissionStatus ] = useState('READY' as IDeleteFolderPermissionStatus)

  // Variables
  const isCurrentUsersFolderPermission = folderPermission.userId === userId

  // Handle Delete Folder Permission
  const handleDeleteFolderPermission = () => {
    setDeleteFolderPermissionStatus('DELETING')
    mutation.deleteFolderPermission(folderPermissionId)
      .then(() => {
        setTimeout(() => {
          setDeleteFolderPermissionStatus('DELETED')
        }, 250)
        setTimeout(() => {
          dispatch(deleteFolderPermission(folderPermission.folderId, folderPermission.id))
        }, 1250)
      })
      .catch(() => {
        setTimeout(() => {
          setDeleteFolderPermissionStatus('ERROR')
        }, 250)
        setTimeout(() => {
          setDeleteFolderPermissionStatus('READY')
        }, 2000)
      })
  }

  const deleteFolderPermissionStatusMessages = {
    READY: <Icon icon={CLOSE} size="0.7rem"/>,
    DELETING: "Deleting...",
    DELETED: "Deleted!",
    ERROR: "Error!"
  }

  return (
    <Container>
      {folderPermission &&
        <>
          <Name>{folderPermission.userName}</Name>
          <Email>{folderPermission.userEmail}</Email>
          <Actions>
            <FoldersPropertiesPermissionsPermissionRoles
              activeRole={folderPermission.role}
              onRoleChange={(nextRole: IFolderPermission['role']) => dispatch(updateFolderPermission(folderPermissionId, { role: nextRole }))}/>
            <Delete
              deleteFolderPermissionStatus={deleteFolderPermissionStatus}
              isCurrentUsersFolderPermission={isCurrentUsersFolderPermission}
              onClick={!isCurrentUsersFolderPermission ? () => handleDeleteFolderPermission() : () => null}>
              {deleteFolderPermissionStatusMessages[deleteFolderPermissionStatus]}
            </Delete>
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

type IDeleteFolderPermissionStatus = 'READY' | 'DELETING' | 'DELETED' | 'ERROR'

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
  cursor: ${ ({ isCurrentUsersFolderPermission }: IDelete) => isCurrentUsersFolderPermission ? 'not-allowed' : 'pointer' };
  padding: ${ ({ deleteFolderPermissionStatus }: IDelete) => ['DELETING', 'DELETED'].includes(deleteFolderPermissionStatus) ? '0.06rem 0.375rem' : '0.06rem 0.15rem' };
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: rgb(225, 225, 225);
  color: black;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    background-color: ${ ({ isCurrentUsersFolderPermission }: IDelete) => isCurrentUsersFolderPermission ? 'rgb(225, 225, 225)' : 'rgb(225, 0, 0)' };
    color: ${ ({ isCurrentUsersFolderPermission }: IDelete) => isCurrentUsersFolderPermission ? 'black' : 'white' };
  }
`
interface IDelete {
  deleteFolderPermissionStatus: IDeleteFolderPermissionStatus
  isCurrentUsersFolderPermission: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesPermissionsPermission
