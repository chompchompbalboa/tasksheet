//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { PLUS_SIGN } from '@/assets/icons'

import { ISheetFile } from '@/state/sheet/types'
import { ISheetCellFilesUploadStatus } from '@desktop/Sheet/SheetCellFiles'

import SheetCellFilesDropdownFile from '@desktop/Sheet/SheetCellFilesDropdownFile'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellFilesDropdown = ({
  deleteSheetCellFile,
  downloadSheetCellFile,
  openFileUploadDialog,
  sheetCellFiles,
  uploadSheetCellFileProgress,
  uploadSheetCellFileStatus
}: ISheetCellFilesDropdown) => {
  
  const uploadSheetCellFileStatusMessages = {
    READY: 'Click here to upload a file',
    NEED_AN_ACCOUNT_TO_UPLOAD: 'Please sign in to an account to upload files',
    PREPARING_UPLOAD: 'Preparing Upload',
    SAVING_FILE_DATA: 'Saving File Data...',
    UPLOADING: 'Uploading',
    UPLOADED: 'Uploaded!',
  }

  const uploadSheetCellFileProgressMessages = (uploadSheetCellFileStatus: ISheetCellFilesUploadStatus) => {
    const percentages = {
      READY: '',
      NEED_AN_ACCOUNT_TO_UPLOAD: '',
      PREPARING_UPLOAD: '',
      UPLOADING: uploadSheetCellFileProgress + '%',
      SAVING_FILE_DATA: '',
      UPLOADED: '',
    }
    return percentages[uploadSheetCellFileStatus]
  }

  return (
    <Container>
      <Files>
        {sheetCellFiles && sheetCellFiles.length > 0 
          ? <>
              {sheetCellFiles.map(sheetCellFile => (
                <SheetCellFilesDropdownFile 
                  key={sheetCellFile.id}
                  deleteSheetCellFile={deleteSheetCellFile}
                  downloadSheetCellFile={downloadSheetCellFile}
                  sheetCellFile={sheetCellFile}/>
              ))}
              <UploadFileButton
                onClick={() => openFileUploadDialog()}>
                {uploadSheetCellFileStatus === 'READY'
                  ? <Icon icon={PLUS_SIGN} size="0.85rem" />
                  : uploadSheetCellFileStatusMessages[uploadSheetCellFileStatus] + ' ' + uploadSheetCellFileProgressMessages(uploadSheetCellFileStatus)
                }
              </UploadFileButton>
            </>
          : <NoFileMessage
              onClick={() => openFileUploadDialog()}>
              {uploadSheetCellFileStatusMessages[uploadSheetCellFileStatus]} {uploadSheetCellFileProgressMessages(uploadSheetCellFileStatus)}
            </NoFileMessage>

      }
      </Files>
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellFilesDropdown {
  deleteSheetCellFile(fileId: ISheetFile['id']): void
  downloadSheetCellFile(fileId: ISheetFile['id']): void
  openFileUploadDialog(): void
  sheetCellFiles: ISheetFile[]
  uploadSheetCellFileProgress: number
  uploadSheetCellFileStatus: ISheetCellFilesUploadStatus
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: absolute;
  top: calc(100% + 2.5px);
  left: -4px;
  background-color: rgb(245, 245, 245);
  width: 40vw;
  height: 60vh;
  border-radius: 5px;
  padding: 2rem;
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const Files = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`

const NoFileMessage = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
`

const UploadFileButton = styled.div`
  cursor: pointer;
  align-self: flex-end;
  margin-top: 0.75rem;
  margin-right: 0.5rem;
  padding: 0.375rem 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  background-color: rgba(180, 180, 180, 0.25);
  color: rgb(25, 25, 25);
  border-radius: 5px;
  transition: background-color 0.15s;
  &:hover {
    background-color: rgba(180, 180, 180, 0.5);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellFilesDropdown
