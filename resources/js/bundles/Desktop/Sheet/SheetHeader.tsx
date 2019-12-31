//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, RefObject, useEffect, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet, 
  ISheetColumn,
} from '@/state/sheet/types'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  selectSheetColumns,
  updateSheetActive,
  updateSheetColumn
} from '@/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import SheetHeaderResizeContainer from '@desktop/Sheet/SheetHeaderResizeContainer'
//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetHeader = ({
  sheetId,
  column,
  gridContainerRef,
  handleContextMenu,
  isLast,
  isNextColumnAColumnBreak,
  visibleColumnsIndex
}: ISheetHeaderProps) => {
  
  const dispatch = useDispatch()
  const rangeStartColumnId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeStartColumnId)
  const columnRenamingId = useSelector((state: IAppState) => state.sheet.active.columnRenamingId)
  
  const isColumnBreak = column.id === 'COLUMN_BREAK'

  const [ isRenaming, setIsRenaming ] = useState(false)
  const [ columnName, setColumnName ] = useState(column && column.name && column.name.length > 0 ? column.name : '?')
  const [ isResizing, setIsResizing ] = useState(false)

  const handleAutosizeInputBlur = () => {
    if(columnName !== null) {
      handleColumnRenamingFinish()
    }
  }
  
  useEffect(() => {
    if(columnRenamingId === column.id) { 
      setIsRenaming(true)
      batch(() => {
        dispatch(preventSelectedCellEditing(sheetId))
        dispatch(preventSelectedCellNavigation(sheetId))
      })
      addEventListener('keypress', handleKeypressWhileColumnIsRenaming)
    }
    else {
      removeEventListener('keypress', handleKeypressWhileColumnIsRenaming)
    }
    return () => removeEventListener('keypress', handleKeypressWhileColumnIsRenaming)
  }, [ columnName, columnRenamingId ])
  
  const handleContainerMouseDown = (e: MouseEvent) => {
    if(e.shiftKey && !isRenaming) {
      dispatch(selectSheetColumns(sheetId, rangeStartColumnId, column.id))
    }
    else if (!isRenaming) {

      dispatch(selectSheetColumns(sheetId, column.id))
    } 
  }
  
  const handleKeypressWhileColumnIsRenaming = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      handleColumnRenamingFinish()
    }
  }
  
  const handleColumnRenamingFinish = () => {
    setIsRenaming(false)
    batch(() => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
      dispatch(updateSheetActive({ columnRenamingId: null }))
    })
    setTimeout(() => dispatch(updateSheetColumn(column.id, { name: columnName }, { name: column.name })), 250)
  }

  const handleColumnResizeEnd = (columnWidthChange: number) => {
    dispatch(updateSheetColumn(column.id, { width: Math.max(column.width + columnWidthChange, 20) }))
  }

  return (
    <Container
      data-testid="SheetHeader"
      containerWidth={column.width}
      isColumnBreak={isColumnBreak}
      isLast={isLast}
      isNextColumnAColumnBreak={isNextColumnAColumnBreak}
      isResizing={isResizing}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'COLUMN', column.id, visibleColumnsIndex)}>
      {!isRenaming
        ? <NameContainer
            data-testid="SheetHeaderNameContainer"
            isColumnBreak={isColumnBreak}
            onMouseDown={(e: MouseEvent) => handleContainerMouseDown(e)}>
            {columnName}
          </NameContainer>
        : <AutosizeInput
            autoFocus
            placeholder="Name..."
            onChange={e => setColumnName(e.target.value)}
            onBlur={() => handleAutosizeInputBlur()}
            onSubmit={() => handleAutosizeInputBlur()}
            value={columnName === null ? "" : columnName}
            inputStyle={{
              margin: '0',
              paddingLeft: '0.14rem',
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: 'transparent',
              color: 'black',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 'bold'}}/>
      }
      {!isColumnBreak && 
        <SheetHeaderResizeContainer
          gridContainerRef={gridContainerRef}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={handleColumnResizeEnd}/>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetHeaderProps {
  sheetId: ISheet['id']
  column: ISheetColumn
  gridContainerRef: RefObject<HTMLDivElement>
  handleContextMenu(e: MouseEvent, type: string, id: string, index?: number): void
  isLast: boolean
  isNextColumnAColumnBreak: boolean
  visibleColumnsIndex: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: ${ ({ isResizing }: ContainerProps) => isResizing ? '1000' : '10' };
  position: relative;
  cursor: ${ ({ isResizing }: ContainerProps) => isResizing ? 'col-resize' : 'default' };
  display: inline-flex;
  user-select: none;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  height: 100%;
  text-align: left;
  background-color: ${({ isColumnBreak }: ContainerProps ) => isColumnBreak ? 'rgb(190, 190, 190)' : 'rgb(250, 250, 250)'};
  box-shadow: ${({ isNextColumnAColumnBreak }: ContainerProps ) => isNextColumnAColumnBreak ? 'inset 0 -1px 0px 0px rgba(190,190,190,1)' : 'inset 0 -1px 0px 0px rgba(180,180,180,1)'};
  border-right: ${ ({ isColumnBreak, isNextColumnAColumnBreak, isLast }: ContainerProps ) => 
    isColumnBreak || isNextColumnAColumnBreak 
      ? '0.5px solid rgb(190, 190, 190)'
      : isLast 
        ? '1px solid rgb(180, 180, 180)' 
        : '1px solid rgb(230, 230, 230)'
  };
  &:hover {
    background-color: ${({ isColumnBreak }: ContainerProps ) => isColumnBreak ? 'rgb(190, 190, 190)' : 'rgb(243, 243, 243)'};
  }
`
interface ContainerProps {
  containerWidth: number
  isColumnBreak: boolean
  isLast: boolean
  isNextColumnAColumnBreak: boolean
  isResizing: boolean
}

const NameContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.25rem 0 0.25rem 0.125rem;
  width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${({ isColumnBreak }: NameContainerProps ) => isColumnBreak ? 'transparent' : 'rgb(50, 50, 50)'};
`
interface NameContainerProps {
  isColumnBreak: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeader
