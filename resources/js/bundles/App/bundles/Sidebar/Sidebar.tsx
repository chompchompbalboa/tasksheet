//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectUserColorPrimary } from '@app/state/user/selectors'
import { selectUserLayoutSidebarWidth } from '@app/state/user/selectors'

import ResizeContainer from '@app/components/ResizeContainer'

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
const Container = styled(ResizeContainer)`
	position: fixed;
	top: 0;
	left: 0;
	width: ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw' };
	height: 100vh;
	overflow-y: scroll;
	background-color: ${ ({ sidebarBackgroundColor }: ContainerProps) => sidebarBackgroundColor };
	overflow-y: scroll;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
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
