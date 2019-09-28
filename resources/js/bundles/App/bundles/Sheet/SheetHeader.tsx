//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { batch, connect, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { 
  ISheet, 
  ISheetActive, ISheetActiveUpdates, 
  ISheetColumn, ISheetColumnUpdates 
} from '@app/state/sheet/types'
import { selectActive } from '@app/state/sheet/selectors'
import {
  allowSelectedCellEditing as allowSelectedCellEditingAction,
  allowSelectedCellNavigation as allowSelectedCellNavigationAction,
  preventSelectedCellEditing as preventSelectedCellEditingAction,
  preventSelectedCellNavigation as preventSelectedCellNavigationAction,
  selectSheetColumns as selectSheetColumnsAction
} from '@app/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'
import ResizeContainer from '@app/components/ResizeContainer'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  active: selectActive(state)
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeader = ({
  sheetId,
  active: {
    columnRenamingId
  },
  column: {
    id,
    name,
    width
  },
  handleContextMenu,
  isLast,
  isNextColumnAColumnBreak,
  isResizing,
  onResizeStart,
  onResizeEnd,
  updateSheetActive,
  updateSheetColumn,
  visibleColumnsIndex
}: SheetHeaderProps) => {
  
  const dispatch = useDispatch()
  const rangeStartColumnId = useSelector((state: AppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].selections.rangeStartColumnId)
  const selectSheetColumns = (startColumnId: ISheetColumn['id'], endColumnId?: ISheetColumn['id']) => dispatch(selectSheetColumnsAction(sheetId, startColumnId, endColumnId))
  const allowSelectedCellEditing = () => dispatch(allowSelectedCellEditingAction(sheetId))
  const allowSelectedCellNavigation = () => dispatch(allowSelectedCellNavigationAction(sheetId))
  const preventSelectedCellEditing = () => dispatch(preventSelectedCellEditingAction(sheetId))
  const preventSelectedCellNavigation = () => dispatch(preventSelectedCellNavigationAction(sheetId))
  
  const isColumnBreak = id === 'COLUMN_BREAK'

  const [ isRenaming, setIsRenaming ] = useState(false)
  const [ columnName, setColumnName ] = useState(name && name.length > 0 ? name : '?')
  const handleAutosizeInputBlur = () => {
    if(columnName !== null) {
      handleColumnRenamingFinish()
    }
  }
  
  useEffect(() => {
    if(columnRenamingId === id) { 
      setIsRenaming(true)
      batch(() => {
        preventSelectedCellEditing()
        preventSelectedCellNavigation()
      })
      addEventListener('keypress', handleKeypressWhileColumnIsRenaming)
    }
    else {
      removeEventListener('keypress', handleKeypressWhileColumnIsRenaming)
    }
    return () => removeEventListener('keypress', handleKeypressWhileColumnIsRenaming)
  }, [ columnName, columnRenamingId ])
  
  const handleContainerClick = (e: MouseEvent) => {
    if(e.shiftKey && !isRenaming) {
      selectSheetColumns(rangeStartColumnId, id)
    }
    else if (!isRenaming) {
      selectSheetColumns(id)
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
      allowSelectedCellEditing()
      allowSelectedCellNavigation()
      updateSheetActive({ columnRenamingId: null })
    })
    setTimeout(() => updateSheetColumn(id, { name: columnName }), 250)
  }

  return (
    <Container
      containerWidth={width}
      isColumnBreak={isColumnBreak}
      isLast={isLast}
      isNextColumnAColumnBreak={isNextColumnAColumnBreak}
      isResizing={isResizing}
      onClick={(e: MouseEvent) => handleContainerClick(e)}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'COLUMN', id, visibleColumnsIndex)}>
      {!isRenaming
        ? <NameContainer
            isColumnBreak={isColumnBreak}>
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
              fontSize: 'inherit',
              fontWeight: 'inherit'}}/>
      }
      {!isColumnBreak && 
        <ResizeContainer
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}/>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeaderProps {
  sheetId: ISheet['id']
  active?: ISheetActive
  column: ISheetColumn
  handleContextMenu(e: MouseEvent, type: string, id: string, index?: number): void
  isLast: boolean
  isNextColumnAColumnBreak: boolean
  isResizing: boolean
  onResizeStart(): void
  onResizeEnd(widthChange: number): void
  updateSheetActive(updates: ISheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: ISheetColumnUpdates): void
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
  font-size: 0.875rem;
  font-weight: bold;
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
  color: ${({ isColumnBreak }: NameContainerProps ) => isColumnBreak ? 'transparent' : 'inherit'};
`
interface NameContainerProps {
  isColumnBreak: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetHeader)
