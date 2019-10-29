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
  Content = null,
  testId = 'Content'
}: ContentProps) => {
  return (
    <Container
      data-testid={testId}>
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
  testId?: string
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
  padding-top: calc(2.5rem + 5px);
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
  padding-left: 5px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: rgb(10, 10, 10);
`

const ContentItems = styled.div`
  height: calc(100% - 2.5rem);
  width: 100%;
  overflow-y: scroll;
  background-color: rgb(254, 254, 254);
  border-top: 1px solid rgb(220, 220, 220);
  border-left: 1px solid rgb(220, 220, 220);
  border-top-left-radius: 7px;
  display: flex;
`
//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContentComponent
