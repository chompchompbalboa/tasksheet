//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PLUS_SIGN, UPLOAD } from '@/assets/icons'

import { IAppState } from '@/state'

import { createSheet } from '@/state/sheet/actions'
import { updateModal } from '@/state/modal/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const FoldersSidebar = () => {
  
  // Redux
  const dispatch = useDispatch()
  const activeFolderPath = useSelector((state: IAppState) => state.folder.activeFolderPath)
  const rootFolderIds = useSelector((state: IAppState) => state.folder.rootFolderIds)
  
  // State
  const [ isSheetCurrentlyBeingCreated, setIsSheetCurrentlyBeingCreated ] = useState(false)

  // Variables
  const activeFolderId = activeFolderPath.length > 0 ? activeFolderPath[activeFolderPath.length - 1] : rootFolderIds[0]

  return (
    <Container>
      <ActionsContainer>
        <Action
          onClick={() => {
            setIsSheetCurrentlyBeingCreated(true)
            dispatch(createSheet(activeFolderId, 'New Sheet', true))
            setTimeout(() => {
              setIsSheetCurrentlyBeingCreated(false)
            }, 2500)
          }}>
          <ActionIcon><Icon icon={PLUS_SIGN} size="0.85rem"/></ActionIcon>
          <ActionText>{isSheetCurrentlyBeingCreated ? 'Creating...' : 'New Sheet'}</ActionText>
        </Action>
        <Action
          onClick={() => dispatch(updateModal({ activeModal: 'CREATE_SHEET_FROM_CSV', createSheetFolderId: activeFolderId }))}>
          <ActionIcon><Icon icon={UPLOAD} size="0.85rem"/></ActionIcon>
          <ActionText>Upload CSV</ActionText>
        </Action>
      </ActionsContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgb(240, 240, 240);
`

const ActionsContainer = styled.div``

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
