//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'

import { mutation } from '@/api'

import { IAppState } from '@/state'
import { IFilePermission } from '@/state/folder/types'

import { 
  deleteFilePermissions,
  updateFilePermission
} from '@/state/folder/actions'

import Icon from '@/components/Icon'
import FoldersPropertiesFilePermissionsPermissionRoles from '@desktop/Folders/FoldersPropertiesFilePermissionsPermissionRoles'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesFilePermissionsPermission = ({
  filePermissionId
}: IFoldersPropertiesFilePermissionsPermission) => {
  
  // Redux
  const dispatch = useDispatch()
  const folderPermission = useSelector((state: IAppState) => state.folder.allFilePermissions && state.folder.allFilePermissions[filePermissionId])
  const userId = useSelector((state: IAppState) => state.user.id)

  // State
  const [ deleteFilePermissionStatus, setDeleteFilePermissionStatus ] = useState('READY' as IDeleteFilePermissionStatus)

  // Variables
  const isCurrentUsersFilePermission = folderPermission.userId === userId

  // Handle Delete Folder Permission
  const handleDeleteFilePermission = () => {
    setDeleteFilePermissionStatus('DELETING')
    mutation.deleteFilePermission(filePermissionId)
      .then(response => {
        setTimeout(() => {
          setDeleteFilePermissionStatus('DELETED')
        }, 250)
        setTimeout(() => {
          console.log(response.data)
          dispatch(deleteFilePermissions(response.data as IFilePermission['id'][]))
        }, 1250)
      })
      .catch(() => {
        setTimeout(() => {
          setDeleteFilePermissionStatus('ERROR')
        }, 250)
        setTimeout(() => {
          setDeleteFilePermissionStatus('READY')
        }, 2000)
      })
  }

  const deleteFilePermissionStatusMessages = {
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
            <FoldersPropertiesFilePermissionsPermissionRoles
              activeRole={folderPermission.role}
              onRoleChange={(nextRole: IFilePermission['role']) => dispatch(updateFilePermission(filePermissionId, { role: nextRole }))}/>
            <Delete
              deleteFilePermissionStatus={deleteFilePermissionStatus}
              isCurrentUsersFilePermission={isCurrentUsersFilePermission}
              onClick={!isCurrentUsersFilePermission ? () => handleDeleteFilePermission() : () => null}>
              {deleteFilePermissionStatusMessages[deleteFilePermissionStatus]}
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
interface IFoldersPropertiesFilePermissionsPermission {
  filePermissionId: IFilePermission['id']
}

type IDeleteFilePermissionStatus = 'READY' | 'DELETING' | 'DELETED' | 'ERROR'

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
  cursor: ${ ({ isCurrentUsersFilePermission }: IDelete) => isCurrentUsersFilePermission ? 'not-allowed' : 'pointer' };
  padding: ${ ({ deleteFilePermissionStatus }: IDelete) => ['DELETING', 'DELETED'].includes(deleteFilePermissionStatus) ? '0.06rem 0.375rem' : '0.06rem 0.15rem' };
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
    background-color: ${ ({ isCurrentUsersFilePermission }: IDelete) => isCurrentUsersFilePermission ? 'rgb(225, 225, 225)' : 'rgb(225, 0, 0)' };
    color: ${ ({ isCurrentUsersFilePermission }: IDelete) => isCurrentUsersFilePermission ? 'black' : 'white' };
  }
`
interface IDelete {
  deleteFilePermissionStatus: IDeleteFilePermissionStatus
  isCurrentUsersFilePermission: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesFilePermissionsPermission
