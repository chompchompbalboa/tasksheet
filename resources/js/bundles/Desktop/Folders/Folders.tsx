//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from '@/state'

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
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)

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
          key="ROOT"
          folderId="ROOT"
          handleFileOpen={handleFileOpen}
          level={0}/>
        {activeFolderPath.length > 0 && activeFolderPath.map((folderId: string, index: number) => (
            <FoldersFolder 
              key={folderId}
              folderId={folderId}
              handleFileOpen={handleFileOpen}
              level={index + 1}/>))}
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
