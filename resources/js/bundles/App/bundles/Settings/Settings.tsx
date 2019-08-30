//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SettingsUserColor from '@app/bundles/Settings/SettingsUserColor'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Settings = ({
  isActiveTab
}: SheetProps) => {
  return (
    <Container
      isActiveTab={isActiveTab}>
      <SettingsUserColor />
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: ${ ({ isActiveTab }: ContainerProps) => isActiveTab ? 'block' : 'none' };
  position: relative;
  width: 100%;
  height: 100%;
`
interface ContainerProps {
  isActiveTab: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Settings
