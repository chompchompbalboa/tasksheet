//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, ReactText } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheet, ISheetRow } from '@/state/sheet/types'
import {
  selectSheetRows as selectSheetRowsAction
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetRowLeader = memo(({
  sheetId,
  rowId,
  handleContextMenu = () => null,
  isRowBreak,
  style,
  text = null
}: ISheetRowLeaderProps) => {
  
  const dispatch = useDispatch()
  const selectSheetRows = (startRowId: ISheetRow['id'], endRowId?: ISheetRow['id']) => dispatch(selectSheetRowsAction(sheetId, startRowId, endRowId))
  const rangeStartRowId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeStartRowId)
  
  const handleMouseDown = (e: MouseEvent) => {
    if(e.button !== 2) {
      if(rowId !== 'ROW_BREAK') {
        if(e.shiftKey) {
          const nextRangeStartRowId = rangeStartRowId || rowId
          const nextRangeEndRowId = rowId
          selectSheetRows(nextRangeStartRowId, nextRangeEndRowId)
        }
        else {
          selectSheetRows(rowId)
        }
      }
    }
  }
  
  return (
    <Container
      data-testid="SheetRowLeader"
      onMouseDown={(e: MouseEvent) => handleMouseDown(e)}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'ROW', rowId)}
      isRowBreak={isRowBreak}
      style={style}>
      <TextContainer
        isTextVisible={text !== null}>
        {text || '-'}
      </TextContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetRowLeaderProps {
  sheetId: ISheet['id']
  rowId: ISheetRow['id']
  handleContextMenu?(e: MouseEvent, type: string, id: string, index?: number): void
  isRowBreak: boolean
  style: {},
  text?: ReactText
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: inline-flex;
  justify-content: center;
  user-select: none;
  height: 100%;
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
  padding: 0 0.25rem 0 0.1rem;
  font-size: 0.7rem;
  width: calc(100% - 3px);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${ ({ isTextVisible }: TextContainerProps ) => isTextVisible ? 'inherit' : 'transparent'};
  opacity: 0.6;
`
interface TextContainerProps {
  isTextVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetRowLeader
