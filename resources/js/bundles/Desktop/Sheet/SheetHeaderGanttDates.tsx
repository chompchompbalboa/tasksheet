//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheetGantt } from '@/state/sheet/types'

import { updateSheetGantt } from '@/state/sheet/actions'

import SheetHeaderGanttDate from '@desktop/Sheet/SheetHeaderGanttDate'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetHeaderGanttDates = ({
  sheetGanttId
}: ISheetHeaderGanttDates) => {

  // Redux
  const dispatch = useDispatch()
  const sheetGantt = useSelector((state: IAppState) => state.sheet.allSheetGantts[sheetGanttId])

  return (
    <Container
      data-testid="SheetHeaderGanttDates">
      {sheetGantt &&
        <>
          <SheetHeaderGanttDate
            onDateChange={nextDate => dispatch(updateSheetGantt(sheetGantt.id, { startDate: moment(nextDate).format('YYYY-MM-DD HH:mm:ss') }, { startDate: sheetGantt.startDate }))}
            text={moment(sheetGantt.startDate).format('MM/DD/YY')}/>
          <Divider>
            -
          </Divider>
          <SheetHeaderGanttDate
            onDateChange={nextDate => dispatch(updateSheetGantt(sheetGantt.id, { endDate: moment(nextDate).format('YYYY-MM-DD HH:mm:ss') }, { endDate: sheetGantt.endDate }))}
            text={moment(sheetGantt.endDate).format('MM/DD/YY')}/>
        </>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetHeaderGanttDates {
  sheetGanttId: ISheetGantt['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Divider = styled.div`
  margin: 0 0.25rem;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetHeaderGanttDates
