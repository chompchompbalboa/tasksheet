//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { IFolder } from '@/state/folder/types'

import FoldersPropertiesFolderPermissionsCreatePermission from '@desktop/Folders/FoldersPropertiesFolderPermissionsCreatePermission'
import FoldersPropertiesFolderPermissionsPermission from '@desktop/Folders/FoldersPropertiesFolderPermissionsPermission'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesFolderPermissions = ({
  folderId
}: IFoldersPropertiesFolderPermissions) => {
  
  // Redux
  const folderPermissions = useSelector((state: IAppState) => state.folder.allFolders && state.folder.allFolders[folderId] && state.folder.allFolders[folderId].permissions)

  return (
    <Container>
      {folderPermissions && folderPermissions.map(folderPermissionId => (
        <FoldersPropertiesFolderPermissionsPermission
          key={folderPermissionId}
          folderPermissionId={folderPermissionId}/>
      ))}
      <FoldersPropertiesFolderPermissionsCreatePermission
        folderId={folderId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesFolderPermissions {
  folderId: IFolder['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesFolderPermissions
