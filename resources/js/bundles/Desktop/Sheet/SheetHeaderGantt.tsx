//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet, 
  ISheetColumn,
} from '@/state/sheet/types'
import SheetHeaderGanttDates from '@/bundles/Desktop/Sheet/SheetHeaderGanttDates'
import SheetHeaderGanttRanges from '@desktop/Sheet/SheetHeaderGanttRanges'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetHeaderGantt = ({
  sheetId, 
  columnId,
  isResizing
}: ISheetHeaderGantt) => {

  // Redux
  const sheetGanttId = useSelector((state: IAppState) => state.sheet.allSheets[sheetId]?.gantts[columnId])

  return (
    <Container
      data-testid="SheetHeaderGantt"
      isResizing={isResizing}>
      <SheetHeaderGanttRanges
        sheetId={sheetId}
        columnId={columnId}
        sheetGanttId={sheetGanttId}/>
      <SheetHeaderGanttDates
        sheetGanttId={sheetGanttId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetHeaderGantt {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
  isResizing: boolean
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-right: ${ ({ isResizing }: IContainer ) => isResizing ? '25px' : '22px' };
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
interface IContainer {
  isResizing: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGantt
