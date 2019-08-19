//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PLUS_SIGN } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Folder } from '@app/state/folder/types'
import { createSheet as createSheetAction } from '@app/state/sheet/actions'
import { selectActiveFolderPath, selectRootFolderIds } from '@app/state/folder/selectors'
import { ModalUpdates } from '@app/state/modal/types'
import { updateModal as updateModalAction } from '@app/state/modal/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersSidebar = ({
}: FoldersSidebarProps) => {

  // State
  const activeFolderPath = useSelector((state: AppState) => selectActiveFolderPath(state))
  const rootFolderIds = useSelector((state: AppState) => selectRootFolderIds(state))
  // Dispatch
  const dispatch = useDispatch()
  const createSheet = useCallback((folderId: Folder['id']) => dispatch(createSheetAction(folderId)), [])
  const updateModal = useCallback((updates: ModalUpdates) => dispatch(updateModalAction(updates)), [])

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
          <ActionIcon><Icon icon={PLUS_SIGN} size="0.85rem"/></ActionIcon>
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
  padding: 0.4rem;
  padding-top: 3rem;
`

const ActionsContainer = styled.div`
`

const Action = styled.div`
  cursor: default;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  padding: 0.2rem 0;
`

const ActionIcon = styled.span`
  display: flex;
  align-items: center;
`

const ActionText = styled.span`
  margin-left: 0.25rem;
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.75rem;
  &:hover {
    text-decoration: underline;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default FoldersSidebar
