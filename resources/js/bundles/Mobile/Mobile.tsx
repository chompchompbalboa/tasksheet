//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import File from '@mobile/File/File'
import Site from '@desktop/Site/Site'
import Tabs from '@mobile/Tabs/Tabs'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const MobileApp = () => {
  
  const isDemoUser = useSelector((state: IAppState) => state.user.tasksheetSubscription.type === 'DEMO')
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)
  const openFiles = useSelector((state: IAppState) => state.user.active.tabs)
  const openFileId = useSelector((state: IAppState) => state.user.active.tab)

  return (
    <Container
      userColorPrimary={userColorPrimary}>
      {isDemoUser 
        ? <>
            <Site />
            <SpreadsheetIcon
              src={environment.assetUrl + 'images/spreadsheet.png'}/>
          </>
        : <>
            <Tabs />
            <OpenFilesContainer>
              {openFiles.map((fileId) => (
                <OpenFileContainer
                  key={fileId}
                  isActiveFile={openFileId === fileId}>
                  <File
                    fileId={fileId}/>
                </OpenFileContainer>))
              }
            </OpenFilesContainer>
          </>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${ ({ userColorPrimary }: ContainerProps) => userColorPrimary };
`
interface ContainerProps {
  userColorPrimary: string
}

const SpreadsheetIcon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: auto;
  opacity: 0.1;
`

const OpenFilesContainer = styled.div`
  z-index: 1;
  position: absolute;
  top: calc(3rem + 1px);
  width: 100%;
  height: calc(100% - 3rem - 1px);
  box-shadow: -1px 0px 10px 0px rgba(0,0,0,0.5);
`

const OpenFileContainer = styled.div`
  position: relative;
  display: ${ ({ isActiveFile }: FileContainerProps) => isActiveFile ? 'block' : 'none' };
  width: 100%;
  height: 100%;
`
interface FileContainerProps {
  isActiveFile: boolean
}

export default MobileApp
