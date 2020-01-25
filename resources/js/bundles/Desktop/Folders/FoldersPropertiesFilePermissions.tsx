//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { IFile } from '@/state/folder/types'

import FoldersPropertiesFilePermissionsCreatePermission from '@desktop/Folders/FoldersPropertiesFilePermissionsCreatePermission'
import FoldersPropertiesFilePermissionsPermission from '@desktop/Folders/FoldersPropertiesFilePermissionsPermission'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesFilePermissions = ({
  fileId
}: IFoldersPropertiesFilePermissions) => {
  
  // Redux
  const filePermissions = useSelector((state: IAppState) => state.folder.allFiles && state.folder.allFiles[fileId] && state.folder.allFiles[fileId].permissions)

  return (
    <Container>
      {filePermissions && filePermissions.map(filePermissionId => (
        <FoldersPropertiesFilePermissionsPermission
          key={filePermissionId}
          filePermissionId={filePermissionId}/>
      ))}
      <FoldersPropertiesFilePermissionsCreatePermission
        fileId={fileId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesFilePermissions {
  fileId: IFile['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesFilePermissions
