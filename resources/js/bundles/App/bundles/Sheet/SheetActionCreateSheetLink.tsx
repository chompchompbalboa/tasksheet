//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { SAVE_SHEET_VIEW } from '@app/assets/icons' 

import { IAppState } from '@app/state'
import { updateIsSavingNewFile } from '@app/state/folder/actions'
import { createSheetLink } from '@app/state/sheet/actions'
import { updateActiveTab } from '@app/state/tab/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCreateSheetLink = ({
  sheetId
}: ISheetActionCreateSheetLink) => {

  const dispatch = useDispatch()

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  const handleClick = () => {
    dispatch(updateActiveTab('FOLDERS'))
    dispatch(updateIsSavingNewFile(true, (newViewName: string) => {
      dispatch(createSheetLink(sheetId, newViewName))
      dispatch(updateIsSavingNewFile(false, null))
    }))
  }

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={() => handleClick()}>
      <Icon
        icon={SAVE_SHEET_VIEW}
        size="1.1rem"/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionCreateSheetLink {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: ContainerProps) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface ContainerProps {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCreateSheetLink
