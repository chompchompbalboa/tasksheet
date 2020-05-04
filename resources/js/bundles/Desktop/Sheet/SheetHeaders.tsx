//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, RefObject } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'

import SheetHeader from '@desktop/Sheet/SheetHeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaders = ({
  sheetId,
  containerWidth = '100%',
  gridContainerRef,
  handleContextMenu,
  startingIndex = 0
}: SheetHeadersProps) => {

  // Redux
  const sheetViewVisibleColumns = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheetViews && state.sheet.allSheetViews[state.sheet.allSheets[sheetId].activeSheetViewId].visibleColumns)
  
  // Is Next Column A Column Break
  const isNextColumnAColumnBreak = (index: number) => {
    return sheetViewVisibleColumns[index + 1] && sheetViewVisibleColumns[index + 1] === 'COLUMN_BREAK'
  } 

  return (
    <Container
      containerWidth={containerWidth}>
      <SheetRowLeaderHeader>
        <SheetRowLeaderHeaderText>
          +
        </SheetRowLeaderHeaderText>
      </SheetRowLeaderHeader>
      {sheetViewVisibleColumns.map((columnId: string, index: number) => {
        if(index >= startingIndex) {
          return (
            <SheetHeader
              key={index}
              sheetId={sheetId}
              columnId={columnId}
              gridContainerRef={gridContainerRef}
              handleContextMenu={handleContextMenu}
              isLast={index === sheetViewVisibleColumns.length - 1}
              isNextColumnAColumnBreak={isNextColumnAColumnBreak(index)}
              visibleColumnsIndex={index}/>
          )
        }
      }
      )}
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetHeadersProps {
  sheetId: ISheet['id']
  containerWidth?: string
  gridContainerRef: RefObject<HTMLDivElement>
  handleContextMenu(e: MouseEvent, type: string, id: string, index?: number): void
  skipLeader?: boolean
  startingIndex?: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 1000;
  position: sticky;
  top: 0;
  left: 0;
  width: ${ ({ containerWidth }: IContainer ) => containerWidth };
  height: 1.8rem;
`
interface IContainer {
  containerWidth: string
}

const SheetRowLeaderHeader = styled.div`
  z-index: 10;
  position: relative;
  cursor: default;
  display: inline-flex;
  user-select: none;
  width: 35px;
  height: 100%;
  text-align: left;
  background-color: rgb(250, 250, 250);
  box-shadow: inset 0 -1px 0px 0px rgba(180,180,180,1);
  border-right: 1px solid rgb(230, 230, 230);
  &:hover {
    background-color: rgb(243, 243, 243);
  }
`

const SheetRowLeaderHeaderText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.25rem 0 0.25rem 0.125rem;
  width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: bold;
  color: transparent;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaders
