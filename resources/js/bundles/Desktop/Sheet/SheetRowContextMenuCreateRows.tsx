//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { KeyboardEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useSheetEditingPermissions } from '@/hooks'

import { 
  ISheet, 
  ISheetRow 
} from '@/state/sheet/types'
import { 
  createMessengerMessage
} from '@/state/messenger/actions'
import {  
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  createSheetRows,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRowContextMenuCreateRows = ({
  testId,
  sheetId,
  sheetRowId,
  aboveOrBelow,
  closeOnClick
}: ISheetRowContextMenuCreateRowsProps) => {

  // Redux
  const dispatch = useDispatch()

  // State
  const [ inputValue, setInputValue ] = useState(1)  

  // Permissions
  const { 
    userHasPermissionToEditSheet,
    userHasPermissionToEditSheetErrorMessage
  } = useSheetEditingPermissions(sheetId)

  // Effects
  useEffect(() => {
    return () => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
    }
  }, [])

  // Create Rows
  const createRows = () => {
    if(!userHasPermissionToEditSheet) {
      dispatch(createMessengerMessage(userHasPermissionToEditSheetErrorMessage))
    }
    else {
      closeOnClick(() => {
        dispatch(allowSelectedCellEditing(sheetId))
        dispatch(allowSelectedCellNavigation(sheetId))
        dispatch(createSheetRows(sheetId, inputValue, sheetRowId, aboveOrBelow))
      })
    }
  }
  
  // Handle Input Blur
  const handleInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }
  
  // Handle Input Focus
  const handleInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }

  // Handle Input Key Press
  const handleInputKeyPress = (e: KeyboardEvent) => {
    if(e.key === "Enter") {
      createRows()
    }
  }

  return (
    <Container
      data-testid={testId + "Container"}>
      <LeftPadding  />
      <TextContainer 
        onClick={() => createRows()}>
        Add
      </TextContainer>
      <StyledInput
        data-testid={testId + "Input"}
        value={inputValue === 0 ? '' : inputValue}
        onBlur={handleInputBlur}
        onChange={e => setInputValue(Math.min(Number(e.target.value), 25))}
        onFocus={handleInputFocus}
        onKeyPress={handleInputKeyPress}/>
      <TextContainer 
        onClick={() => createRows()}>
        row{inputValue > 1 ? 's' : ''} {aboveOrBelow.toLowerCase()}
      </TextContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetRowContextMenuCreateRowsProps {
  testId: string
  sheetId: ISheet['id']
  sheetRowId: ISheetRow['id']
  aboveOrBelow: 'ABOVE' | 'BELOW'
  closeOnClick(...args: any): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  min-width: 8rem;
  width: 100%;
  padding: 0.55rem 0.75rem 0.425rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transition: background-color 0.05s;
  border-radius: 3px 3px 0 0;
  &:hover {
    background-color: rgb(242, 242, 242);
  }
`

const StyledInput = styled.input`
  margin: 0 0.25rem;
  padding: 0.125rem 0.05rem;
  height: 100%;
  width: 1.5rem;
  border: none;
  border-bottom: 0.5px solid rgb(180, 180, 180);
  color: rgb(110, 110, 110);
  background-color: transparent;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  text-align: center;
`

const LeftPadding = styled.div`
margin: 0 0.5rem;
width: 0.75rem;
display: flex;
align-items: center;
justify-content: center;
`

const TextContainer = styled.span``

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowContextMenuCreateRows
