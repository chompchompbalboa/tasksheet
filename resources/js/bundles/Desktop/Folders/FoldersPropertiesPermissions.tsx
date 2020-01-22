//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { IFolder } from '@/state/folder/types'

import FoldersPropertiesPermissionsPermission from '@desktop/Folders/FoldersPropertiesPermissionsPermission'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersPropertiesPermissions = ({
  folderPermissions
}: IFoldersPropertiesPermissions) => {
  return (
    <Container>
      {folderPermissions && folderPermissions.map((folderPermissionId, index) => (
        <FoldersPropertiesPermissionsPermission
          key={index}
          folderPermissionId={folderPermissionId}/>
      ))}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IFoldersPropertiesPermissions {
  folderPermissions: IFolder['permissions']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersPropertiesPermissions
