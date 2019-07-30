//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { Files, Folders } from '@app/state/folder/types'
import { 
  updateActiveFileId as updateActiveFileIdAction,
  updateActiveFolderPath as updateActiveFolderPathAction 
} from '@app/state/folder/actions'
import { selectActiveFileId, selectActiveFolderPath, selectFiles, selectFolders, selectIsSavingNewFile, selectOnFileSave, selectRootFolderIds } from '@app/state/folder/selectors'

import FoldersFolder from '@app/bundles/Folders/FoldersFolder'
import FoldersHeader from '@app/bundles/Folders/FoldersHeader'
import FoldersSidebar from '@app/bundles/Folders/FoldersSidebar'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeFileId: selectActiveFileId(state),
  activeFolderPath: selectActiveFolderPath(state),
  files: selectFiles(state),
  folders: selectFolders(state),
  isSavingNewFile: selectIsSavingNewFile(state),
  onFileSave: selectOnFileSave(state),
  rootFolderIds: selectRootFolderIds(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateActiveFileId: (nextActiveFolderId: string) => dispatch(updateActiveFileIdAction(nextActiveFolderId)),
  updateActiveFolderPath: (level: number, nextActiveFolderId: string) => dispatch(updateActiveFolderPathAction(level, nextActiveFolderId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Folders = ({
  activeFileId,
  activeFolderPath,
  files,
  folders,
  handleFileOpen,
  isActiveTab,
  isSavingNewFile,
  onFileSave,
  rootFolderIds,
  updateActiveFileId,
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
          <FoldersHeader
            activeFileId={activeFileId}
            activeFolderPath={activeFolderPath}
            files={files}
            folders={folders}
            isSavingNewFile={isSavingNewFile}
            onFileSave={onFileSave}/>
        </HeaderContainer>
        <FoldersContainer>
          <FoldersFolder
            activeFileId={activeFileId}
            activeFolderPath={activeFolderPath}
            files={files}
            folderId="ROOT"
            folders={folders}
            handleFileOpen={handleFileOpen}
            level={0}
            rootFolderIds={rootFolderIds}
            updateActiveFileId={updateActiveFileId}
            updateActiveFolderPath={updateActiveFolderPath}/>
          {activeFolderPath.length > 0 && 
            activeFolderPath.map((folderId: string, index: number) => (
              <FoldersFolder 
                key={folderId}
                activeFileId={activeFileId}
                activeFolderPath={activeFolderPath}
                files={files}
                folderId={folderId}
                folders={folders}
                handleFileOpen={handleFileOpen}
                level={index + 1}
                rootFolderIds={rootFolderIds}
                updateActiveFileId={updateActiveFileId}
                updateActiveFolderPath={updateActiveFolderPath}/>))}
        </FoldersContainer>
      </ContentContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersProps {
  activeFileId: string
  activeFolderPath: string[]
  files: Files
  folders: Folders
  handleFileOpen(nextActiveTabId: string): void
  isActiveTab: boolean
  isSavingNewFile: boolean
  onFileSave: () => void
  rootFolderIds: string[]
  updateActiveFileId(nextActiveFileId: string): void
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
  width: 0;
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
