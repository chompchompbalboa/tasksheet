//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectUserColorPrimary, selectUserColorSecondary, selectUserLayoutSidebarWidth } from '@app/state/user/selectors'
import { 
  updateUserLayout as updateUserLayoutAction, UserLayoutUpdates
} from '@app/state/user/actions'

import ResizeContainer from '@app/components/ResizeContainer'
import SidebarFolders from '@app/bundles/Sidebar/SidebarFolders'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  resizeContainerBackgroundColor: selectUserColorSecondary(state),
  sidebarBackgroundColor: selectUserColorPrimary(state),
  sidebarWidth: selectUserLayoutSidebarWidth(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // @ts-ignore thunk-action
  updateUserLayout: (updates: UserLayoutUpdates) => dispatch(updateUserLayoutAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Sidebar = ({ 
  resizeContainerBackgroundColor, 
  sidebarBackgroundColor, 
  sidebarWidth,
  updateUserLayout
}: SidebarProps) => (
  <Container
    data-testid="sidebarContainer"
    sidebarBackgroundColor={sidebarBackgroundColor}
    sidebarWidth={sidebarWidth}>
    <SidebarFolders />
    <ResizeContainer
      containerBackgroundColor={resizeContainerBackgroundColor}
      onResize={(widthChange: number) => updateUserLayout({ sidebarWidth: sidebarWidth + widthChange / window.innerWidth })}/>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SidebarProps = {
  resizeContainerBackgroundColor: string
  sidebarBackgroundColor: string
  sidebarWidth: number
  updateUserLayout(updates: UserLayoutUpdates): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw' };
	height: 100vh;
  background-color: ${ ({ sidebarBackgroundColor }: ContainerProps) => sidebarBackgroundColor };
  display: flex;
  justify-content: space-between;
`
type ContainerProps = {
  sidebarBackgroundColor: string
  sidebarWidth: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
