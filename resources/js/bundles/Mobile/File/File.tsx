//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import ErrorBoundary from '@/components/ErrorBoundary'
import Sheet from '@mobile/Sheet/Sheet'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const File = ({
  fileId
}: FileProps) => {

  const file = useSelector((state: IAppState) => state.folder.allFiles[fileId])

  const fileComponents = {
    SHEET: Sheet
  }
  const FileComponent = file ? fileComponents[file.type] : null

  return (
    <StyledErrorBoundary>
      {file &&
        <FileComponent 
          fileId={file.id}
          id={file.typeId}/>
      }
    </StyledErrorBoundary>
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
const StyledErrorBoundary = styled(ErrorBoundary)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default File
