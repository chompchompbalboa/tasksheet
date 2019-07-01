//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectUserLayoutSidebarWidth } from '@app/state/user/selectors'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Sheets = ({ userLayoutSidebarWidth }: SheetsProps) => (
  <Container sidebarWidth={userLayoutSidebarWidth}>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetsProps {
  userLayoutSidebarWidth: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: fixed;
  top: 0;
  left: ${ ({ sidebarWidth }: ContainerProps) => (sidebarWidth * 100) + 'vw'}
`
interface ContainerProps {
  sidebarWidth: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(Sheets)
