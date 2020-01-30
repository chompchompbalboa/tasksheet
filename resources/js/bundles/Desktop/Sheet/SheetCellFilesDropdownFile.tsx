//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'

import { DOWNLOAD, TRASH_CAN } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheetFile } from '@/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellFilesDropdown = ({
  deleteSheetCellFile,
  downloadSheetCellFile,
  sheetCellFile
}: ISheetCellFilesDropdown) => {

  // Redux
  const isDemoUser = useSelector((state: IAppState) => state.user.sortsheetSubscription.type === 'DEMO')

  // State
  const [ deleteSheetCellFileStatus, setDeleteSheetCellFileStatus ] = useState('READY' as ISheetCellFileDeleteStatus)

  // Timeouts
  const setStatusToDeletedTimeout = useRef(null)
  const deleteSheetCellFileTimeout = useRef(null)
  
  // Effects
  useEffect(() => {
    return () => {
      clearTimeout(setStatusToDeletedTimeout.current)
      clearTimeout(deleteSheetCellFileTimeout.current)
    }
  }, [])

  // Delete Status Messages
  const deleteSheetCellFileStatusMessages = {
    READY: '',
    NEED_AN_ACCOUNT_TO_DELETE: 'Please sign in to delete this file',
    DELETING: 'Deleting...',
    DELETED: 'Deleted'
  }

  // Handle Sheet Cell File Delete
  const handleSheetCellFileDelete = () => {
    if(!isDemoUser) {
      setDeleteSheetCellFileStatus('DELETING')
      setTimeout(() => setDeleteSheetCellFileStatus('DELETED'), 350)
      setTimeout(() => {
        setDeleteSheetCellFileStatus('READY')
        deleteSheetCellFile(sheetCellFile.id)
      }, 500)
    }
    else {
      setDeleteSheetCellFileStatus('NEED_AN_ACCOUNT_TO_DELETE')
      setTimeout(() => setDeleteSheetCellFileStatus('READY'), 5000)
    }
  }
  
  // Trim Active Sheet Cell File Filename To 50 Characters
  const filename = sheetCellFile.filename
  const filenameMaxLength = 50
  const trimmedFilename = filename.length > filenameMaxLength ? filename.substring(0, filenameMaxLength - 3) + "..." : filename.substring(0, filenameMaxLength)

  return (
    <Container>
      <FileDetails>
        <FileName>{trimmedFilename}</FileName>
        <FileUploadedBy>{sheetCellFile.uploadedBy} / {moment(sheetCellFile.uploadedAt).format('MMMM Do, YYYY / hh:mma')}</FileUploadedBy>
      </FileDetails>
        <FileActions>
          <FileAction
            onClick={() => downloadSheetCellFile(sheetCellFile.id)}>
            <Icon icon={DOWNLOAD} size="0.85rem"/>
          </FileAction>
          <FileAction
            onClick={() => handleSheetCellFileDelete()}>
            {deleteSheetCellFileStatus === 'READY' 
              ? <Icon icon={TRASH_CAN} size="0.85rem"/>
              : deleteSheetCellFileStatusMessages[deleteSheetCellFileStatus]
            }
          </FileAction>
        </FileActions>
    </Container>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellFilesDropdown {
  deleteSheetCellFile(fileId: ISheetFile['id']): void
  downloadSheetCellFile(fileId: ISheetFile['id']): void
  sheetCellFile: ISheetFile
}

type ISheetCellFileDeleteStatus =
  'READY' | 
  'NEED_AN_ACCOUNT_TO_DELETE' |
  'DELETING' | 
  'DELETED'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  transition: background-color 0.15s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(245, 245, 245);
`

const FileDetails = styled.div`
  z-index: 1;
  width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FileName = styled.div`
  text-overflow: ellipsis;
  font-size: 0.85rem;
  font-weight: bold;
`

const FileUploadedBy = styled.div`
  font-size: 0.75rem;
`

const FileActions = styled.div`
  z-index: 2;
  width: 25%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const FileAction = styled.div`
  cursor: pointer;
  margin-left: 0.25rem;
  padding: 0.375rem 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  background-color: rgba(180, 180, 180, 0.25);
  color: rgb(25, 25, 25);
  border-radius: 5px;
  transition: background-color 0.15s;
  white-space: nowrap;
  &:hover {
    background-color: rgba(180, 180, 180, 0.5);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellFilesDropdown
