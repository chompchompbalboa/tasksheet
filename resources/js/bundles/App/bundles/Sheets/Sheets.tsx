//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { selectTabs } from '@app/state/tab/selectors'
import { selectUserLayoutSidebarWidth } from '@app/state/user/selectors'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  tabs: selectTabs(state),
  userLayoutSidebarWidth: selectUserLayoutSidebarWidth(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Sheets = ({ 
  tabs,
  userLayoutSidebarWidth
}: SheetsProps) => {
  console.log(tabs)
  return (
    <Container sidebarWidth={userLayoutSidebarWidth}>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetsProps {
  tabs: string[]
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
