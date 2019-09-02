//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const ContentComponent = ({
  Sidebar = null,
  Header = null,
  Content = null
}: ContentProps) => {
  return (
    <Container>
      <SidebarContainer>
        {Sidebar && <Sidebar />}
      </SidebarContainer>
      <ContentContainer>
        <ContentHeader>
          {Header && <Header />}
        </ContentHeader>
        <ContentItems>
          {Content && <Content />}
        </ContentItems>
      </ContentContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ContentProps {
  Sidebar?: any
  Header?: any
  Content?: any
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
`

const SidebarContainer = styled.div`
  padding-top: 2.5rem;
  min-width: 8rem;
`

const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ContentHeader = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
`

const ContentItems = styled.div`
  height: calc(100% - 2.5rem);
  width: 100%;
  overflow-y: scroll;
  background-color: white;
  border-top: 1px solid rgb(220, 220, 220);
  border-left: 1px solid rgb(220, 220, 220);
  display: flex;
`
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContentComponent
