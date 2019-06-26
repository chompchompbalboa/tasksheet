//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectUserColorPrimary } from '@app/state/user/selectors'
import { selectUserLayoutSidebarWidth } from '@app/state/user/selectors'

import ResizeContainer from '@app/components/ResizeContainer'
import SidebarFolders from '@app/bundles/Sidebar/SidebarFolders'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  sidebarBackgroundColor: selectUserColorPrimary(state),
  sidebarWidth: selectUserLayoutSidebarWidth(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Sidebar = ({ sidebarBackgroundColor, sidebarWidth }: SidebarProps) => (
  <Container
    sidebarBackgroundColor={sidebarBackgroundColor}
    sidebarWidth={sidebarWidth}>
    <SidebarFolders />
    <ResizeContainer />
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type SidebarProps = {
  sidebarBackgroundColor: string
  sidebarWidth: number
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
  mapStateToProps
)(Sidebar)
