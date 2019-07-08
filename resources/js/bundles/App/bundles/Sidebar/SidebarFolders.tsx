//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectActiveFolderId, selectFolders, selectRootFolders } from '@app/state/folder/selectors'
import { Folders } from '@app/state/folder/types'

import SidebarFoldersHeader from '@app/bundles/Sidebar/SidebarFoldersHeader'
import SidebarFoldersFile from '@app/bundles/Sidebar/SidebarFoldersFile'
import SidebarFoldersFolder from '@app/bundles/Sidebar/SidebarFoldersFolder'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeFolderId: selectActiveFolderId(state),
  folders: selectFolders(state),
  rootFolders: selectRootFolders(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SidebarFolders = ({
  activeFolderId,
  folders,
  rootFolders
}: SidebarFolderProps) => {
  const activeFolder = folders[activeFolderId]
  const folderIds: any = activeFolderId !== null ? activeFolder.folders : rootFolders
  const fileIds: any = activeFolderId !== null ? activeFolder.files : []
  return (
    <Container>
      <SidebarFoldersHeader
        activeFolder={activeFolder}/>
      <Folders>
        {folderIds.map((folderId: string) => (
          <SidebarFoldersFolder 
            key={folderId}
            id={folderId}/>
        ))}
      </Folders>
      <Files>
        {fileIds.map((fileId: string) => (
          <SidebarFoldersFile
            key={fileId}
            id={fileId}/>
        ))}
      </Files>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarFolderProps = {
  activeFolderId: string
  folders: Folders
  rootFolders: string[]
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
`

const Folders = styled.div`
  width: 100%;
`

const Files = styled.div`
  width: 100%;
`

export default connect(
  mapStateToProps
)(SidebarFolders)
