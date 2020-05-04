//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { PLUS_SIGN } from '@/assets/icons'

import { 
  ISheet,
  ISheetColumn,
  ISheetGantt
} from '@/state/sheet/types'

import {
  createSheetGanttRange
} from '@/state/sheet/actions'

import Icon from '@/components/Icon'
import SheetColumnsList from '@desktop/Sheet/SheetColumnsList'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetHeaderGanttRangesCreateRange = ({
  sheetId,
  sheetGanttId
}: ISheetHeaderGanttRangesCreateRange) => {

  // Redux
  const dispatch = useDispatch()

  // State
  const [ sheetGanttRangeStartColumnId, setSheetGanttRangeStartColumnId ] = useState(null)
  const [ sheetGanttRangeEndColumnId, setSheetGanttRangeEndColumnId ] = useState(null)

  return (
    <Container>
      <ColumnsContainer>
        <SheetColumnsList
          sheetId={sheetId}
          alternateText="Start Column"
          cellTypes={[ 'DATETIME' ]}
          currentColumnId={sheetGanttRangeStartColumnId}
          onColumnClick={(clickedColumnId: ISheetColumn['id']) => setSheetGanttRangeStartColumnId(clickedColumnId)}/>
        <ColumnNameDivider>-</ColumnNameDivider> 
        <SheetColumnsList
          sheetId={sheetId}
          alternateText="End Column (Optional)"
          cellTypes={[ 'DATETIME' ]}
          currentColumnId={sheetGanttRangeEndColumnId}
          onColumnClick={(clickedColumnId: ISheetColumn['id']) => setSheetGanttRangeEndColumnId(clickedColumnId)}/>
      </ColumnsContainer>
      <CreateGanttRangeContainer>
        <CreateGanttRangeButton
          data-testid="SheetHeaderGanttRangesCreateRangeButton"
          onClick={() => {
            if(sheetGanttRangeStartColumnId) {
              dispatch(createSheetGanttRange(sheetId, sheetGanttId, sheetGanttRangeStartColumnId, sheetGanttRangeEndColumnId))
              setSheetGanttRangeStartColumnId(null)
              setSheetGanttRangeEndColumnId(null)
            }
          }}>
          <Icon 
            icon={PLUS_SIGN}
            size="1rem"/>
        </CreateGanttRangeButton>
      </CreateGanttRangeContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetHeaderGanttRangesCreateRange {
  sheetId: ISheet['id']
  sheetGanttId: ISheetGantt['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
`

const ColumnsContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`

const ColumnNameDivider = styled.div`
  margin: 0 0.25rem;
`

const CreateGanttRangeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CreateGanttRangeButton = styled.div`
  cursor: pointer;
  margin-left: 0.625rem;
  padding: 0.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  &:hover {
    background-color: rgb(230, 230, 230);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGanttRangesCreateRange
