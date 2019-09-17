//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { BOLD } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'
import {
  updateSheetCell
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleBold = ({
  sheetId
}: SheetActionCellStyleBoldProps) => {
  
  const dispatch = useDispatch()
  
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  const cells = useSelector((state: AppState) => state.sheet.cells)
  const activeSelections = useSelector((state: AppState) => state.sheet.active.selections)
  
  const [ localActiveSelections, setLocalActiveSelections ] = useState(activeSelections)
  useEffect(() => {
    if(activeSelections.cellId && activeSelections.rangeStartCellId) {
      setLocalActiveSelections(activeSelections)
    }
  }, [ activeSelections ])

  const handleContainerClick = () => {
    const rangeStartCell = cells && localActiveSelections && localActiveSelections.rangeStartCellId && cells[localActiveSelections.rangeStartCellId]
    if(rangeStartCell) {
      const nextRangeStartCellFontWeight = rangeStartCell.style && rangeStartCell.style.fontWeight && rangeStartCell.style.fontWeight === 'bold' ? 'normal' : 'bold'
      // Check the style on the first cell to see if we should bold or unbold
      dispatch(updateSheetCell(rangeStartCell.id, { style: { fontWeight: nextRangeStartCellFontWeight }}))
    }
  }

  return (
    <Container
      containerBackgroundColor={userColorPrimary}
      onClick={handleContainerClick}>
      <Icon 
        icon={BOLD}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleBoldProps {
  sheetId: Sheet['id']
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
  text-decoration: none;
  border-radius: 3px;
  padding: 0.4rem;
  transition: all 0.05s;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
  containerBackgroundColor: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleBold
