//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { Files, Folders } from '@app/state/folder/types'
import { updateActiveFolderPath as updateActiveFolderPathAction } from '@app/state/folder/actions'
import { selectActiveFolderPath, selectFiles, selectFolders, selectRootFolderIds } from '@app/state/folder/selectors'

import FoldersFolder from '@app/bundles/Folders/FoldersFolder'
import FoldersSidebar from '@app/bundles/Folders/FoldersSidebar'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeFolderPath: selectActiveFolderPath(state),
  files: selectFiles(state),
  folders: selectFolders(state),
  rootFolderIds: selectRootFolderIds(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateActiveFolderPath: (level: number, nextActiveFolderId: string) => dispatch(updateActiveFolderPathAction(level, nextActiveFolderId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Folders = ({
  activeFolderPath,
  files,
  folders,
  handleFileOpen,
  isActiveTab,
  rootFolderIds,
  updateActiveFolderPath
}: FoldersProps) => {
  return (
    <Container
      isActiveTab={isActiveTab}>
      <SidebarContainer>
        <FoldersSidebar />
      </SidebarContainer>
      <ContentContainer>
        <HeaderContainer>
        </HeaderContainer>
        <FoldersContainer>
          <FoldersFolder
            activeFolderPath={activeFolderPath}
            files={files}
            folderId="ROOT"
            folders={folders}
            level={0}
            rootFolderIds={rootFolderIds}
            updateActiveFolderPath={updateActiveFolderPath}
            handleFileOpen={handleFileOpen}/>
          {activeFolderPath.length > 0 && 
            activeFolderPath.map((folderId: string, index: number) => (
              <FoldersFolder 
                key={folderId}
                activeFolderPath={activeFolderPath}
                files={files}
                folderId={folderId}
                folders={folders}
                level={index + 1}
                rootFolderIds={rootFolderIds}
                updateActiveFolderPath={updateActiveFolderPath}
                handleFileOpen={handleFileOpen}/>))}
        </FoldersContainer>
      </ContentContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersProps {
  activeFolderPath: string[]
  files: Files
  folders: Folders
  handleFileOpen(nextActiveTabId: string): void
  isActiveTab: boolean
  rootFolderIds: string[]
  updateActiveFolderPath(level: number, nextActiveFolderId: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'flex' : 'none' };
  width: 100%;
  height: 100%;
  display: flex;
`
interface ContainerProps {
  isActiveTab: boolean
}


const SidebarContainer = styled.div`
  width: 10rem;
  height: 100%;
`

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const FoldersContainer = styled.div`
  width: 100%;
  height: calc(100% - 3rem);
  display: flex;
`

const HeaderContainer = styled.div`
  width: 100%;
  height: 3rem;
  background-color: rgb(225, 225, 225);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folders)
