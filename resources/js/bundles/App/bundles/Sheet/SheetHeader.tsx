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
  isResizing,
  onResizeStart,
  onResizeEnd,
  updateSheetActive,
  updateSheetColumn
}: SheetHeaderProps) => {

  const [ isRenaming, setIsRenaming ] = useState(false)
  const [ columnName, setColumnName ] = useState(name)
  const handleAutosizeInputBlur = () => {
    if(columnName !== null) {
      setIsRenaming(false)
      updateSheetActive({ columnRenamingId: null })
      setTimeout(() => updateSheetColumn(id, { name: columnName }), 25)
    }
  }
  
  useEffect(() => {
    if(columnRenamingId === id) { setIsRenaming(true) }
  }, [ columnRenamingId ])

  return (
    <Container
      containerWidth={width}
      isLast={isLast}
      isResizing={isResizing}
      onContextMenu={(e: MouseEvent) => handleContextMenu(e, 'COLUMN', id)}>
      {!isRenaming
        ? <NameContainer>
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
      <ResizeContainer
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeaderProps {
  active?: SheetActive
  column: SheetColumn
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  isLast: boolean
  isResizing: boolean
  onResizeStart(): void
  onResizeEnd(widthChange: number): void
  updateSheetActive(updates: SheetActiveUpdates): void
  updateSheetColumn(columnId: string, updates: SheetColumnUpdates): void
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
  background-color: rgb(250, 250, 250);
  box-shadow: inset 0 -1px 0px 0px rgba(180,180,180,1);
  border-right: ${ ({ isLast }: ContainerProps ) => isLast ? '1px solid rgb(180, 180, 180)' : 'none'};
  font-size: 0.875rem;
  font-weight: bold;
`
interface ContainerProps {
  containerWidth: number
  isLast: boolean
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
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetHeader)
