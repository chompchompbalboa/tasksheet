//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment, { Moment } from 'moment'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import { 
  updateSheetCellValues
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  sheetId,
  dateValidator,
  value,
  updateCellValue,
}: ISheetCellDatetimeProps) => {

  // Refs
  const styledInput = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const sheetSelectionsRangeCellIds = useSelector((state: IAppState) => state.sheet.allSheets[sheetId].selections.rangeCellIds)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // Is Value Valid Date
  const isValueValidDate = dateValidator(value)

  // State
  const [ currentMonth, setCurrentMonth ] = useState(isValueValidDate ? moment(value) : moment())

  // Effects
  useEffect(() => {
    styledInput.current && styledInput.current.focus()
  }, [])

  // Build the array to display the dates
  let currentMonthDatesArray = []
  const isValueInCurrentMonth = isValueValidDate && currentMonth.year() === moment(value).year() && currentMonth.month() === moment(value).month()
  const valueDate = isValueValidDate && moment(value).date()
  let daysInCurrentMonth = currentMonth.daysInMonth()
  const firstDayOfCurrentMonth = currentMonth.startOf('month').day()
  let previousMonthsDate = 0
  while(previousMonthsDate < firstDayOfCurrentMonth) {
    currentMonthDatesArray.push(null)
    previousMonthsDate++
  }
  for(let currentDate = 1; currentDate <= daysInCurrentMonth; currentDate++) {
    currentMonthDatesArray.push(currentDate)
  }

  // Handle a change in the current visible month
  const handleChangeCurrentMonth = (nextCurrentMonth: Moment) => {
    setCurrentMonth(nextCurrentMonth)
  }

  // Handle a change in cell value
  const handleStyledInputChange = (nextSheetCellValue: string) => {
    if(sheetSelectionsRangeCellIds.size === 0) {
      updateCellValue(nextSheetCellValue)
    }
    else {
      dispatch(updateSheetCellValues(sheetId, nextSheetCellValue))
    }
  }

  return (
    <Container
      data-testid="SheetCellDatetimeDatepicker">
      <InputContainer>
        <StyledInput
          data-testid="SheetCellDatetimeDatepickerInput"
          ref={styledInput}
          onChange={e => handleStyledInputChange(e.target.value)}
          value={value || ''}/>
      </InputContainer>
      {sheetSelectionsRangeCellIds.size === 0 &&
        <DropdownContainer>
          <DatepickerHeader>
            <GoToPreviousMonth
              data-testid="SheetCellDatetimeDatepickerGoToPreviousMonth"
              onClick={() => handleChangeCurrentMonth(moment(currentMonth).subtract(1, 'M'))}>
              <Icon
                icon={ARROW_LEFT}/>
            </GoToPreviousMonth>
            <CurrentMonth>
              {currentMonth.format('MMMM YYYY')}
            </CurrentMonth>
            <GoToNextMonth
              data-testid="SheetCellDatetimeDatepickerGoToNextMonth"
              onClick={() => handleChangeCurrentMonth(moment(currentMonth).add(1, 'M'))}>
              <Icon
                icon={ARROW_RIGHT}/>
            </GoToNextMonth>
          </DatepickerHeader>
          <DatepickerDates
            data-testid="SheetCellDatetimeDatepickerDates">
            {currentMonthDatesArray.map((currentDate, index) =>
              <DatepickerDate
                key={index}
                isEmpty={currentDate === null}
                isSelected={isValueInCurrentMonth && valueDate === currentDate}
                onClick={currentDate !== null ? () => updateCellValue(moment(currentMonth).date(currentDate).format('MM/DD/YYYY')) : () => null}
                userColorPrimary={userColorPrimary}>
                {currentDate}
              </DatepickerDate>
            )}
          </DatepickerDates>
        </DropdownContainer>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellDatetimeProps {
  sheetId: ISheet['id']
  dateValidator(date: any): boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
`

const InputContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
`

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
`

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`

const DatepickerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ChangeCurrentMonth = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`

const GoToPreviousMonth = styled(ChangeCurrentMonth)`
  border-top-left-radius: 5px;
`

const GoToNextMonth = styled(ChangeCurrentMonth)`
border-top-right-radius: 5px;
`

const CurrentMonth = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const DatepickerDates = styled.div`
  margin: 0.25rem;
  width: 11.5rem;
  display: flex;
  flex-flow: row wrap;
`

const DatepickerDate = styled.div`
  cursor: pointer;
  width: calc(11.5rem / 7);
  height: calc(11.5rem / 7);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  background-color: ${ ({ isSelected, userColorPrimary }: IDatePickerDate) => isSelected ? userColorPrimary : 'transparent'};
  color: ${ ({ isSelected }: IDatePickerDate) => isSelected ? 'white' : 'inherit'};
  &:hover {
    background-color: ${ ({ isEmpty, isSelected, userColorPrimary }: IDatePickerDate) => isSelected ? userColorPrimary : (isEmpty ? 'transparent' : 'rgb(240, 240, 240)')};
  }
`
interface IDatePickerDate {
  isEmpty: boolean
  isSelected: boolean
  userColorPrimary: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
