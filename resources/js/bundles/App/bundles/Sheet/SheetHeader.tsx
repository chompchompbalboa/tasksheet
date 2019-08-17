//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '@app/state'
import { SheetActive, SheetActiveUpdates, SheetColumn, SheetColumnUpdates } from '@app/state/sheet/types'
import { selectActive } from '@app/state/sheet/selectors'

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
  
  const isColumnBreak = id === 'COLUMN_BREAK'

  const [ isRenaming, setIsRenaming ] = useState(false)
  const [ columnName, setColumnName ] = useState(name)
  const handleAutosizeInputBlur = () => {
    if(columnName !== null) {
      setIsRenaming(false)
      updateSheetActive({ columnRenamingId: null })
      setTimeout(() => updateSheetColumn(id, { name: columnName }), 50)
    }
  }
  
  useEffect(() => {
    if(columnRenamingId === id) { setIsRenaming(true) }
  }, [ columnRenamingId ])

  return (
    <Container
      containerWidth={width}
      isColumnBreak={isColumnBreak}
      isLast={isLast}
      isNextColumnAColumnBreak={isNextColumnAColumnBreak}
      isResizing={isResizing}
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
  active?: SheetActive
  column: SheetColumn
  handleContextMenu(e: MouseEvent, type: string, id: string, index?: number): void
  isLast: boolean
  isNextColumnAColumnBreak: boolean
  isResizing: boolean
  onResizeStart(): void
  onResizeEnd(widthChange: number): void
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
  visibleColumnsIndex: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: ${ ({ isResizing }: ContainerProps) => isResizing ? 'col-resize' : 'default' };
  display: inline-flex;
  user-select: none;
  width: ${ ({ containerWidth }: ContainerProps ) => containerWidth + 'px'};
  height: 100%;
  text-align: left;
  background-color: ${({ isColumnBreak }: ContainerProps ) => isColumnBreak ? 'rgb(190, 190, 190)' : 'rgb(250, 250, 250)'};
  box-shadow: ${({ isNextColumnAColumnBreak }: ContainerProps ) => isNextColumnAColumnBreak ? 'inset 0 -1px 0px 0px rgba(190,190,190,1)' : 'inset 0 -1px 0px 0px rgba(180,180,180,1)'};
  box-shadow: inset 0 -1px 0px 0px rgba(180,180,180,1);
  border-right: ${ ({ isNextColumnAColumnBreak, isLast }: ContainerProps ) => 
    isNextColumnAColumnBreak 
      ? '0.5px solid rgb(190, 190, 190)'
      : isLast 
        ? '1px solid rgb(180, 180, 180)' 
        : 'none'
  };
  font-size: 0.875rem;
  font-weight: bold;
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
  padding: 0.28rem 0 0.28rem 0.14rem;
  width: calc(100% - 3px);
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
