//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'

import { IAppState } from '@app/state'

import ErrorBoundary from '@/components/ErrorBoundary'
import Sheet from '@app/bundles/Sheet/Sheet'
import SheetMobile from '@app/bundles/SheetMobile/SheetMobile'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const File = ({
  fileId
}: FileProps) => {
  
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' })

  const file = useSelector((state: IAppState) => state.folder.files[fileId])

  const fileComponents = {
    SHEET: Sheet
  }
  const mobileFileComponents = {
    SHEET: SheetMobile
  }
  const FileComponent = file ? fileComponents[file.type] : null
  const MobileFileComponent = file ? mobileFileComponents[file.type] : null

  return (
    <StyledErrorBoundary>
      {file && !isMobile &&
        <FileComponent 
          fileId={file.id}
          id={file.typeId}/>
      }
      {file && isMobile &&
        <MobileFileComponent 
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
  background-color: rgb(230, 230, 230);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default File
