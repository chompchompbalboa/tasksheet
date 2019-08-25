//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { SAVE_SHEET_VIEW } from '@app/assets/icons' 

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  updateIsSavingNewFile as updateIsSavingNewFileAction
 } from '@app/state/folder/actions'
 import { 
   createSheetView as createSheetViewAction
  } from '@app/state/sheet/actions'
import { 
  updateActiveTabId as updateActiveTabIdAction
 } from '@app/state/tab/actions'
 import { selectUserColorPrimary } from '@app/state/user/selectors'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  userColorPrimary: selectUserColorPrimary(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  createSheetView: (sheetId: string, newViewName: string) => dispatch(createSheetViewAction(sheetId, newViewName)),
  updateIsSavingNewFile: (nextIsSavingNewFile: boolean, onFileSave: () => void) => dispatch(updateIsSavingNewFileAction(nextIsSavingNewFile, onFileSave)),
  updateActiveTabId: (nextActiveTabId: string) => dispatch(updateActiveTabIdAction(nextActiveTabId))
})
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSaveView = ({
  createSheetView,
  sheetId,
  updateIsSavingNewFile,
  updateActiveTabId,
  userColorPrimary,
}: SheetActionSaveViewProps) => {

  const handleClick = () => {
    updateActiveTabId('FOLDERS')
    updateIsSavingNewFile(true, (newViewName: string) => {
      createSheetView(sheetId, newViewName)
      updateIsSavingNewFile(false, null)
    })
  }

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={() => handleClick()}>
      <Icon
        icon={SAVE_SHEET_VIEW}
        size="1.1rem"/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionSaveViewProps {
  sheetId: string
  createSheetView(sheetId: string, newViewName: string): void
  updateIsSavingNewFile(nextIsSavingNewFile: boolean, onFileSave: (...args: any) => void): void
  updateActiveTabId(nextActiveTabId: string): void
  userColorPrimary: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: ContainerProps) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface ContainerProps {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetActionSaveView)
