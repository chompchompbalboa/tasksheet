//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PLUS_SIGN, UPLOAD } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { Folder } from '@app/state/folder/types'
import { createSheet as createSheetAction } from '@app/state/sheet/actions'
import { selectActiveFolderPath, selectRootFolderIds } from '@app/state/folder/selectors'
import { IModalUpdates } from '@app/state/modal/types'
import { updateModal as updateModalAction } from '@app/state/modal/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersSidebar = ({
}: FoldersSidebarProps) => {

  // State
  const activeFolderPath = useSelector((state: IAppState) => selectActiveFolderPath(state))
  const rootFolderIds = useSelector((state: IAppState) => selectRootFolderIds(state))
  // Dispatch
  const dispatch = useDispatch()
  const createSheet = useCallback((folderId: Folder['id']) => dispatch(createSheetAction(folderId)), [])
  const updateModal = useCallback((updates: IModalUpdates) => dispatch(updateModalAction(updates)), [])

  const activeFolderId = activeFolderPath.length > 0 ? activeFolderPath[activeFolderPath.length - 1] : rootFolderIds[0]
  
  return (
    <Container>
      <ActionsContainer>
        <Action
          onClick={() => createSheet(activeFolderId)}>
          <ActionIcon><Icon icon={PLUS_SIGN} size="0.85rem"/></ActionIcon>
          <ActionText>New Sheet</ActionText>
        </Action>
        <Action
          onClick={() => updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV', createSheetFolderId: activeFolderId })}>
          <ActionIcon><Icon icon={UPLOAD} size="0.85rem"/></ActionIcon>
          <ActionText>Upload CSV</ActionText>
        </Action>
      </ActionsContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface FoldersSidebarProps {
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgb(240, 240, 240);
`

const ActionsContainer = styled.div`
`

const Action = styled.div`
  cursor: default;
  display: flex;
  align-items: space-between;
  width: 100%;
  white-space: nowrap;
  padding: 0.375rem 1.5rem 0.375rem 0.5rem;
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`

const ActionIcon = styled.span`
  display: flex;
  align-items: center;
`

const ActionText = styled.span`
  margin-left: 0.625rem;
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.75rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersSidebar
