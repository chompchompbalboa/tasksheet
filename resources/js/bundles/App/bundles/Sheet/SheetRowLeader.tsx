//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { ISheet, ISheetRow } from '@app/state/sheet/types'
import {
  selectSheetRows as selectSheetRowsAction
} from '@app/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetRowLeader = memo(({
  sheetId,
  rowId,
  handleContextMenu,
  isRowBreak,
  style,
  text = null
}: SheetRowLeaderProps) => {
  
  const dispatch = useDispatch()
  const selectSheetRows = (startRowId: ISheetRow['id'], endRowId?: ISheetRow['id']) => dispatch(selectSheetRowsAction(sheetId, startRowId, endRowId))
  const rangeStartRowId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeStartRowId)
  
  const handleClick = (e: MouseEvent) => {
    if(e.shiftKey) {
      const nextRangeStartRowId = rangeStartRowId || rowId
      const nextRangeEndRowId = rowId
      selectSheetRows(nextRangeStartRowId, nextRangeEndRowId)
    }
    else {
      selectSheetRows(rowId)
    }
  }
  
  return (
    <Container
      onClick={(e: MouseEvent) => handleClick(e)}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'ROW', rowId)}
      isRowBreak={isRowBreak}
      style={style}>
      <TextContainer
        isTextVisible={text !== null}>
        {text || '1'}
      </TextContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetRowLeaderProps {
  sheetId: ISheet['id']
  rowId: ISheetRow['id']
  handleContextMenu?(e: MouseEvent, type: string, id: string, index?: number): void
  isRowBreak: boolean
  style: {},
  text?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: inline-flex;
  user-select: none;
  height: 100%;
  text-align: left;
  background-color: ${ ({ isRowBreak }: ContainerProps ) => isRowBreak ? 'rgb(190, 190, 190)' : 'rgb(250, 250, 250)'};
  box-shadow: inset -1px -1px 0px 0px rgba(180,180,180,1);
  &:hover {
    background-color: ${ ({ isRowBreak }: ContainerProps ) => isRowBreak ? 'rgb(190, 190, 190)' : 'rgb(235, 235, 235)'};
  }
`
interface ContainerProps {
  isRowBreak: boolean
}

const TextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.25rem;
  font-size: 0.7rem;
  width: calc(100% - 3px);
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${ ({ isTextVisible }: TextContainerProps ) => isTextVisible ? 'inherit' : 'transparent'};
`
interface TextContainerProps {
  isTextVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowLeader
