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
  updateCellValue,
  value
}: SheetCellDatetimeProps) => {  
  
  const safeValue = value === null ? "" : moment(value).format('MM/DD/YYYY')

  return (
    <SheetCellContainer
      focusCell={() => {}}
      value={safeValue}>
      <DatePicker
        autoComplete="new-password"
        autoFocus
        customInput={<StyledInput/>}
        selected={value !== null ? moment(value).toDate() : null}
        onChange={(date: any) => updateCellValue(moment(date).format('YYYY-MM-DD HH:mm:ss'))}/>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellDatetimeProps {
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
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
