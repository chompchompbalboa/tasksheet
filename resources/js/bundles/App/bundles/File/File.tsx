//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import Sheet from '@app/bundles/Sheet/Sheet'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const File = ({
  fileId
}: FileProps) => {

  const file = useSelector((state: IAppState) => state.folder.files[fileId])

  const fileComponents = {
    SHEET: Sheet,
    SHEET_VIEW: Sheet
  }
  const FileComponent = file ? fileComponents[file.type] : null

  return (
    <Container>
      {file 
        ? <FileComponent 
            fileId={file.id}
            id={file.typeId}/>
        : 'Please select a sheet to get started'}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FileProps {
  fileId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(230, 230, 230);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default File
