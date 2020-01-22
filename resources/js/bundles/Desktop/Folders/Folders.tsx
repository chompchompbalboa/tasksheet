//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'
import { 
  updateActiveFolderPath as updateActiveFolderPathAction 
} from '@/state/folder/actions'

import Content from '@desktop/Content/Content'
import FoldersFolder from '@desktop/Folders/FoldersFolder'
import FoldersHeader from '@desktop/Folders/FoldersHeader'
import FoldersProperties from '@desktop/Folders/FoldersProperties'
import FoldersSidebar from '@desktop/Folders/FoldersSidebar'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Folders = ({
  handleFileOpen,
  isActiveTab
}: IFolders) => {

  // Redux
  const dispatch = useDispatch()
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const files = useSelector((state: IAppState) => state.folder.allFiles)
  const folders = useSelector((state: IAppState) => state.folder.allFolders)
  const rootFolderIds = useSelector((state: IAppState) => state.folder.rootFolderIds)
  const updateActiveFolderPath = (level: number, nextActiveFolderId: string) => dispatch(updateActiveFolderPathAction(level, nextActiveFolderId))

  // Sidebar
  const Sidebar = () => {
    return (
      <FoldersSidebar />
     )
  }

  // Header
  const Header = () => {
    return (
      <FoldersHeader />
    )
  }

  // Content
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
        <FoldersProperties />
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
interface IFolders {
  handleFileOpen(nextActiveTabId: string): void
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Folders
