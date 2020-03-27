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
  updateSheetColumn
} from '@/state/sheet/actions'

import { defaultColumn } from '@/state/sheet/defaults'

import SheetHeaderResizeContainer from '@desktop/Sheet/SheetHeaderResizeContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetHeader = ({
  sheetId, 
  columnId,
  gridContainerRef,
  handleContextMenu,
  isLast,
  isNextColumnAColumnBreak,
  visibleColumnsIndex
}: ISheetHeaderProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const sheetColumn = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId])
  const rangeColumnIds = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeColumnIds)
  const rangeStartColumnId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeStartColumnId)

  // Local State
  const [ isRenaming, setIsRenaming ] = useState(false)
  const [ columnName, setColumnName ] = useState(sheetColumn && sheetColumn.name && sheetColumn.name.length > 0 ? sheetColumn.name : '?')
  const [ isResizing, setIsResizing ] = useState(false)
  
  // Local Variables
  const isColumnBreak = columnId === 'COLUMN_BREAK'

  // Effects 
  useEffect(() => {
    if(sheetColumn && sheetColumn.isRenaming) { 
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
  }, [ sheetColumn, columnName ])

  useEffect(() => {
    if(sheetColumn) {
      setColumnName(sheetColumn.name)
    }
  }, [ sheetColumn && sheetColumn.name ])

  // Handle Autosize Input Blur
  const handleAutosizeInputBlur = () => {
    if(columnName !== null) {
      handleColumnRenamingFinish()
    }
  }
  
  // Handle Container Mouse Down
  const handleContainerMouseDown = (e: MouseEvent) => {
    if(!(e.button === 2 && rangeColumnIds.has(columnId))) { // If not right clicked
      if(!isColumnBreak && !isRenaming && e.shiftKey) {
        dispatch(selectSheetColumns(sheetId, rangeStartColumnId, sheetColumn.id))
      }
      else if (!isColumnBreak && !isRenaming) {
        dispatch(selectSheetColumns(sheetId, sheetColumn.id))
      } 
    }
  }
  
  // Handle Keypress While Column Is Renaming
  const handleKeypressWhileColumnIsRenaming = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      handleColumnRenamingFinish()
    }
  }
  
  // Handle Column Renaming Finish
  const handleColumnRenamingFinish = () => {
    setIsRenaming(false)
    batch(() => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
      dispatch(updateSheetColumn(sheetColumn.id, { isRenaming: false }, null, true))
    })
    dispatch(updateSheetColumn(sheetColumn.id, { name: columnName || defaultColumn.name }, { name: sheetColumn.name }))
  }

  // Handle Column Resize End
  const handleColumnResizeEnd = (columnWidthChange: number) => {
    dispatch(updateSheetColumn(sheetColumn.id, { width: Math.max(sheetColumn.width + columnWidthChange, 20) }))
    setIsResizing(false)
  }

  return (
    <Container
      data-testid="SheetHeader"
      containerWidth={columnId === 'COLUMN_BREAK' ? 10 : sheetColumn.width}
      isColumnBreak={isColumnBreak}
      isLast={isLast}
      isNextColumnAColumnBreak={isNextColumnAColumnBreak}
      isResizing={isResizing}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'COLUMN', sheetColumn && sheetColumn.id || 'COLUMN_BREAK', visibleColumnsIndex)}>
      {!(sheetColumn && sheetColumn.isRenaming)
        ? <NameContainer
            data-testid="SheetHeaderNameContainer"
            isColumnBreak={isColumnBreak}
            onMouseDown={(e: MouseEvent) => handleContainerMouseDown(e)}>
            {columnName}
          </NameContainer>
        : <NameInput
            data-testid="SheetHeaderNameInput"
            autoFocus
            placeholder="Name..."
            onChange={e => setColumnName(e.target.value)}
            onBlur={handleAutosizeInputBlur}
            value={columnName || ""}/>
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
  columnId: ISheetColumn['id']
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

const NameInput = styled.input`
  margin: 0;
  padding-left: 0.14rem;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: black;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: bold;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeader
