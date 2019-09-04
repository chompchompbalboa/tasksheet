//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'

import { SheetColumnType } from '@app/state/sheet/types'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellDatetime = ({
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellDatetimeProps) => {  
  
  const safeValue = moment(safeValue).isValid() ? moment(value).format('MM/DD/YYYY') : ''

  const formatNextCellValue = (date: any) => {
    return moment(safeValue).isValid() ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''
  }

  return (
    <StyledSheetCellContainer
      focusCell={() => null}
      updateCellValue={(date: any) => updateCellValue(formatNextCellValue(date))}
      value={safeValue}
      {...passThroughProps}>
      <DatePicker
        autoComplete="new-password"
        autoFocus
        customInput={<StyledInput/>}
        selected={moment(safeValue).isValid() ? moment(safeValue).toDate() : null}
        onChange={(date: any) => updateCellValue(formatNextCellValue(date))}/>
    </StyledSheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellDatetimeProps {
  cellId: string
  columnType: SheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  updateSheetSelectedCell(cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const StyledSheetCellContainer = styled(SheetCellContainer)`
  overflow: visible;
`

const StyledInput = styled.input`
  background-color: transparent;
  outline: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
