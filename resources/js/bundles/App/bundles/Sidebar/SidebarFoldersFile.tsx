//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { FILE_SHEET } from '@app/assets/icons'

import { AppState } from '@app/state'
import { selectFile } from '@app/state/folder/selectors'
import { File } from '@app/state/folder/types'
import { openFileInNewTab as openFileInNewTabAction } from '@app/state/tab/actions'

import SidebarFoldersItem from './SidebarFoldersItem'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SidebarFoldersFileProps) => ({
  file: selectFile(props.id, state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // @ts-ignore thunk-action
  openFileInNewTab: (fileId: string) => dispatch(openFileInNewTabAction(fileId))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SidebarFoldersFile = ({
  file,
  openFileInNewTab
}: SidebarFoldersFileProps) => {
  const {
    id,
    name,
    type
  } = file
  const icons: { [type: string]: string } = {
    SHEET: FILE_SHEET
  }
  return (
    <SidebarFoldersItem
      icon={icons[type]}
      onClick={() => openFileInNewTab(id)}
      text={name}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarFoldersFileProps = {
  id: string
  file?: File
  openFileInNewTab?(fileId: string): void
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarFoldersFile)
