//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { FOLDER } from '@app/assets/icons'

import { AppState } from '@app/state'
import { updateActiveFolderId as updateActiveFolderIdAction } from '@app/state/folder/actions'
import { selectFolder } from '@app/state/folder/selectors'
import { Folder } from '@app/state/folder/types'

import SidebarFoldersItem from './SidebarFoldersItem'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SidebarFoldersFolderProps) => ({
  folder: selectFolder(props.id, state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // @ts-ignore thunk-action
  updateActiveFolderId: (nextActiveFolderId: string) => dispatch(updateActiveFolderIdAction(nextActiveFolderId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SidebarFoldersFolder = ({
  folder,
  updateActiveFolderId
}: SidebarFoldersFolderProps) => {
  const {
    id,
    name
  } = folder
  return (
    <SidebarFoldersItem
      icon={FOLDER}
      onClick={() => updateActiveFolderId(id)}
      text={name}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarFoldersFolderProps = {
  id: string
  folder?: Folder
  updateActiveFolderId?(nextActiveFolderId: string): void
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarFoldersFolder)
