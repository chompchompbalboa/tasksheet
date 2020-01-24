//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { IFolder } from '@/state/folder/types'

import FoldersPropertiesPermissionsCreatePermission from '@desktop/Folders/FoldersPropertiesPermissionsCreatePermission'
import FoldersPropertiesPermissionsPermission from '@desktop/Folders/FoldersPropertiesPermissionsPermission'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesPermissions = ({
  folderId
}: IFoldersPropertiesPermissions) => {
  
  // Redux
  const folderPermissions = useSelector((state: IAppState) => state.folder.allFolders && state.folder.allFolders[folderId] && state.folder.allFolders[folderId].permissions)

  return (
    <Container>
      {folderPermissions && folderPermissions.map(folderPermissionId => (
        <FoldersPropertiesPermissionsPermission
          key={folderPermissionId}
          folderPermissionId={folderPermissionId}/>
      ))}
      <FoldersPropertiesPermissionsCreatePermission
        folderId={folderId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesPermissions {
  folderId: IFolder['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesPermissions
