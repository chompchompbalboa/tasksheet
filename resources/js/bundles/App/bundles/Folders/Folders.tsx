//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { connect } from 'react-redux'

import { IAppState } from '@app/state'
import { IThunkDispatch } from '@app/state/types'
import { IFiles, IFolders } from '@app/state/folder/types'
import { 
  updateActiveFolderPath as updateActiveFolderPathAction 
} from '@app/state/folder/actions'
import { selectActiveFolderPath, selectFiles, selectFolders, selectIsSavingNewFile, selectOnFileSave, selectRootFolderIds } from '@app/state/folder/selectors'

import Content from '@app/bundles/Content/Content'
import FoldersFolder from '@app/bundles/Folders/FoldersFolder'
import FoldersHeader from '@app/bundles/Folders/FoldersHeader'
import FoldersSidebar from '@app/bundles/Folders/FoldersSidebar'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: IAppState) => ({
  activeFolderPath: selectActiveFolderPath(state),
  files: selectFiles(state),
  folders: selectFolders(state),
  isSavingNewFile: selectIsSavingNewFile(state),
  onFileSave: selectOnFileSave(state),
  rootFolderIds: selectRootFolderIds(state)
})

const mapDispatchToProps = (dispatch: IThunkDispatch) => ({
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
  isSavingNewFile,
  onFileSave,
  rootFolderIds,
  updateActiveFolderPath
}: FoldersProps) => {

  const [ isSheetCurrentlyBeingCreated, setIsSheetCurrentlyBeingCreated ] = useState(false)

  const Sidebar = () => {
    return (
      <FoldersSidebar
         isSheetCurrentlyBeingCreated={isSheetCurrentlyBeingCreated}
         setIsSheetCurrentlyBeingCreated={setIsSheetCurrentlyBeingCreated}/>
     )
  }

  const Header = () => {
    return (
      <FoldersHeader
        activeFolderPath={activeFolderPath}
        files={files}
        folders={folders}
        isSavingNewFile={isSavingNewFile}
        onFileSave={onFileSave}/>
    )
  }

  const FoldersContent = () => {
    return (
      <>
        <FoldersFolder
          activeFolderPath={activeFolderPath}
          files={files}
          folderId="ROOT"
          folders={folders}
          handleFileOpen={handleFileOpen}
          level={0}
          rootFolderIds={rootFolderIds}
          updateActiveFolderPath={updateActiveFolderPath}/>
        {activeFolderPath.length > 0 && 
          activeFolderPath.map((folderId: string, index: number) => (
            <FoldersFolder 
              key={folderId}
              activeFolderPath={activeFolderPath}
              files={files}
              folderId={folderId}
              folders={folders}
              handleFileOpen={handleFileOpen}
              level={index + 1}
              rootFolderIds={rootFolderIds}
              updateActiveFolderPath={updateActiveFolderPath}/>))}
      </>
    )
  }

  if(isActiveTab) {
    return (
      <Content
        Sidebar={Sidebar}
        Content={FoldersContent}
        Header={Header}/>
    )
  }
  return null
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersProps {
  activeFolderPath: string[]
  files: IFiles
  folders: IFolders
  handleFileOpen(nextActiveTabId: string): void
  isActiveTab: boolean
  isSavingNewFile: boolean
  onFileSave: () => void
  rootFolderIds: string[]
  updateActiveFolderPath(level: number, nextActiveFolderId: string): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Folders)
