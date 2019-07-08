//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { FILE_STORE } from '@app/assets/icons'

import { AppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { File } from '@app/state/folder/types'
import { openFile as openFileAction } from '@app/state/tab/actions'

import SidebarFoldersItem from './SidebarFoldersItem'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SidebarFoldersFileProps) => ({
  file: selectFile(props.id, state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // @ts-ignore thunk-action
  openFile: (fileId: string) => dispatch(openFileAction(fileId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SidebarFoldersFile = ({
  file,
  openFile
}: SidebarFoldersFileProps) => {
  const {
    id,
    name,
    type
  } = file
  const icons: { [type: string]: string } = {
    STORE: FILE_STORE
  }
  return (
    <SidebarFoldersItem
      icon={icons[type]}
      onClick={() => openFile(id)}
      text={name}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarFoldersFileProps = {
  id: string
  file?: File
  openFile?(fileId: string): void
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarFoldersFile)
