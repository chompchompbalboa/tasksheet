//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'

import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellDatetime = ({
  cellId,
  updateCellValue,
  value
}: SheetCellDatetimeProps) => {  
  
  const safeValue = [null, ""].includes(value) ? "" : moment(value).format('MM/DD/YYYY')

  const formatNextCellValue = (date: any) => {
    return date !== null ? moment(date).format('YYYY-MM-DD HH:mm:ss') : null
  }

  return (
    <StyledSheetCellContainer
      cellId={cellId}
      focusCell={() => {}}
      value={safeValue}>
      <DatePicker
        autoComplete="new-password"
        autoFocus
        customInput={<StyledInput/>}
        selected={![null, ""].includes(value) ? moment(value).toDate() : null}
        onChange={(date: any) => updateCellValue(formatNextCellValue(date))}/>
    </StyledSheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellDatetimeProps {
  cellId: string
  updateCellValue(nextCellValue: string): void
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
