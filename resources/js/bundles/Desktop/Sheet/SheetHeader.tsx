//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, RefObject, useEffect, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN } from '@/assets/icons'

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

import Icon from '@/components/Icon'
import SheetHeaderResizeContainer from '@desktop/Sheet/SheetHeaderResizeContainer'
import SheetColumnContextMenu from './SheetColumnContextMenu'

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

  // Refs
  const openContextMenuButton = useRef(null)
  
  // Redux
  const dispatch = useDispatch()
  const sheetColumn = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId])
  const rangeColumnIds = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeColumnIds)
  const rangeStartColumnId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeStartColumnId)

  // Local State
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuRight, setContextMenuRight ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const [ isRenaming, setIsRenaming ] = useState(false)
  const [ columnName, setColumnName ] = useState(sheetColumn && sheetColumn.name && sheetColumn.name.length > 0 ? sheetColumn.name : '?')
  const [ isResizing, setIsResizing ] = useState(false)
  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ isOpenContextMenuButtonVisible, setIsOpenContextMenuButtonVisible ] = useState(false)
  
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

  useEffect(() => {
    if(isContextMenuVisible) {
      setTimeout(() => addEventListener('click', handleClickWhileContextMenuIsVisible), 10)
    }
    else {
      removeEventListener('click', handleClickWhileContextMenuIsVisible)
    }
    return () => removeEventListener('click', handleClickWhileContextMenuIsVisible)
  }, [ isContextMenuVisible ])

  useEffect(() => {
    setIsContextMenuVisible(false)
  }, [ visibleColumnsIndex ])

  // Handle Autosize Input Blur
  const handleAutosizeInputBlur = () => {
    handleColumnRenamingFinish()
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
  
  // Handle Click While Context Menu Is Visible
  const handleClickWhileContextMenuIsVisible = (e: Event) => {
    e.preventDefault()
    if(!openContextMenuButton.current.contains(e.target)) {
      setIsContextMenuVisible(false)
    }
  }
  
  // Handle Column Renaming Finish
  const handleColumnRenamingFinish = () => {
    const nextColumnName = columnName || defaultColumn(sheetId).name
    setIsRenaming(false)
    setColumnName(nextColumnName)
    batch(() => {
      dispatch(allowSelectedCellEditing(sheetId))
      dispatch(allowSelectedCellNavigation(sheetId))
      dispatch(updateSheetColumn(sheetColumn.id, { isRenaming: false }, null, true))
    })
    dispatch(updateSheetColumn(sheetColumn.id, { name: nextColumnName }, { name: sheetColumn.name }))
  }

  // Handle Column Resize End
  const handleColumnResizeEnd = (columnWidthChange: number) => {
    dispatch(updateSheetColumn(sheetColumn.id, { width: Math.max(sheetColumn.width + columnWidthChange, 20) }))
    setIsResizing(false)
  }

  const handleOpenContextMenuButtonClick = (e: MouseEvent) => {
    if(!isContextMenuVisible) {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      setIsContextMenuVisible(true)
      setContextMenuTop(e.clientY)
      setContextMenuLeft(e.clientX > (windowWidth * 0.75) ? null : e.clientX)
      setContextMenuRight(e.clientX > (windowWidth * 0.75) ? windowWidth - e.clientX : null)
    }
  } 

  return (
    <Container
      data-testid="SheetHeader"
      containerWidth={columnId === 'COLUMN_BREAK' ? 10 : sheetColumn.width}
      isColumnBreak={isColumnBreak}
      isContextMenuVisible={isContextMenuVisible}
      isLast={isLast}
      isNextColumnAColumnBreak={isNextColumnAColumnBreak}
      isResizing={isResizing}
      onMouseEnter={() => setIsOpenContextMenuButtonVisible(true)}
      onMouseLeave={() => setIsOpenContextMenuButtonVisible(false)}
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
            placeholder={defaultColumn(sheetId).name}
            onChange={e => setColumnName(e.target.value)}
            onBlur={handleAutosizeInputBlur}
            value={columnName || ""}/>
      }
      {!isColumnBreak && 
        <>
          <OpenContextMenuButtonContainer
            isResizing={isResizing}
            isVisible={isOpenContextMenuButtonVisible || isContextMenuVisible}>
            <OpenContextMenuButton
              ref={openContextMenuButton}
              isContextMenuVisible={isContextMenuVisible}
              onClick={handleOpenContextMenuButtonClick}>
              <Icon
                icon={ARROW_DOWN}
                size="0.75rem"/>
            {isContextMenuVisible &&
              <SheetColumnContextMenu
                sheetId={sheetId}
                columnId={columnId}
                closeContextMenu={() => {
                  setIsContextMenuVisible(false)
                  setIsOpenContextMenuButtonVisible(false)
                }}
                columnIndex={visibleColumnsIndex}
                contextMenuTop={contextMenuTop}
                contextMenuLeft={contextMenuLeft}
                contextMenuRight={contextMenuRight}/>
            }
          </OpenContextMenuButton>
          </OpenContextMenuButtonContainer>
          <SheetHeaderResizeContainer
            gridContainerRef={gridContainerRef}
            onResizeStart={() => setIsResizing(true)}
            onResizeEnd={handleColumnResizeEnd}/>
        </>
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
  z-index: ${ ({ isContextMenuVisible, isResizing }: ContainerProps) => (isContextMenuVisible || isResizing) ? '1000' : '10' };
  position: relative;
  cursor: ${ ({ isResizing }: ContainerProps) => isResizing ? 'col-resize' : 'default' };
  display: inline-flex;
  user-select: none;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  height: 100%;
  text-align: left;
  background-color: ${({ isColumnBreak }: ContainerProps ) => isColumnBreak ? 'rgb(210, 210, 210)' : 'rgb(250, 250, 250)'};
  box-shadow: ${({ isNextColumnAColumnBreak }: ContainerProps ) => isNextColumnAColumnBreak ? 'inset 0 -1px 0px 0px rgba(190,190,190,1)' : 'inset 0 -1px 0px 0px rgba(180,180,180,1)'};
  border-right: ${ ({ isColumnBreak, isNextColumnAColumnBreak, isLast }: ContainerProps ) => 
    isColumnBreak || isNextColumnAColumnBreak 
      ? '0.5px solid rgb(190, 190, 190)'
      : isLast 
        ? '1px solid rgb(180, 180, 180)' 
        : '1px solid rgb(230, 230, 230)'
  };
  &:hover {
    background-color: ${({ isColumnBreak }: ContainerProps ) => isColumnBreak ? 'rgb(210, 210, 210)' : 'rgb(243, 243, 243)'};
  }
`
interface ContainerProps {
  containerWidth: number
  isContextMenuVisible: boolean
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
  font-size: 0.85rem;
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
  font-size: 0.85rem;
  font-weight: bold;
`

const OpenContextMenuButtonContainer = styled.div`
  position: absolute;
  right: 0;
  height: 100%;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isVisible }: IOpenContextMenu ) => isVisible ? '1' : '0'};
`
interface IOpenContextMenu {
  isResizing: boolean
  isVisible: boolean
}

const OpenContextMenuButton = styled.div`
  padding: 0.05rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${ ({ isContextMenuVisible }: IOpenContextMenuButton ) => isContextMenuVisible ? 'rgb(200, 200, 200)' : 'transparent' };
  color: ${ ({ isContextMenuVisible }: IOpenContextMenuButton ) => isContextMenuVisible ? 'black' : 'rgb(180, 180, 180)' };
  border-radius: 2px;
  &:hover {
    background-color: rgb(200, 200, 200);
    color: black;
  }
`
interface IOpenContextMenuButton {
  isContextMenuVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeader
