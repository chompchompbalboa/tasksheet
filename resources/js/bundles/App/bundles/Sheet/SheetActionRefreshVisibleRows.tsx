//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { REFRESH } from '@app/assets/icons' 

import { IAppState } from '@app/state'
import { refreshSheetVisibleRows } from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionRefreshVisibleRows = ({
  sheetId
}: ISheetActionRefreshVisibleRowsProps) => {

  const dispatch = useDispatch()

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={() => dispatch(refreshSheetVisibleRows(sheetId))}>
      <Icon
        icon={REFRESH}
        size="1.1rem"/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionRefreshVisibleRowsProps {
  sheetId: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-right: 0.375rem;
  margin-left: 0.125rem;
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
export default SheetActionRefreshVisibleRows
