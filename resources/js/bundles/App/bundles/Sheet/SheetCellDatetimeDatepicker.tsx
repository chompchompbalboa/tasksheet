//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import moment, { Moment } from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT } from '@app/assets/icons'

import { IAppState } from '@app/state'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellDatetime = ({
  dateValidator,
  value,
  updateCellValue,
}: ISheetCellDatetimeProps) => {

  const styledInput = useRef(null)
  useEffect(() => {
    styledInput.current && styledInput.current.focus()
  }, [])

  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  const isValueValidDate = dateValidator(value)

  const [ currentMonth, setCurrentMonth ] = useState(
    localStorage.getItem('Tracksheet.SheetCellDatetimeDatepicker.currentMonth')
      ? moment(localStorage.getItem('Tracksheet.SheetCellDatetimeDatepicker.currentMonth'))
      : isValueValidDate ? moment(value) : moment()
  )

  const isValueInCurrentMonth = isValueValidDate && currentMonth.year() === moment(value).year() && currentMonth.month() === moment(value).month()
  const valueDate = isValueValidDate && moment(value).date()

  let currentMonthDatesArray = []
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

  const handleChangeCurrentMonth = (nextCurrentMonth: Moment) => {
    localStorage.setItem('Tracksheet.SheetCellDatetimeDatepicker.currentMonth', nextCurrentMonth.toISOString())
    setCurrentMonth(nextCurrentMonth)
  }

  return (
    <Container
      data-testid="SheetCellDatetimeDatepicker">
      <InputContainer>
        <StyledInput
          data-testid="SheetCellDatetimeDatepickerInput"
          ref={styledInput}
          onChange={e => updateCellValue(e.target.value)}
          value={value || ''}/>
      </InputContainer>
      <DropdownContainer>
        <DatepickerHeader>
          <GoToPreviousMonth
            onClick={() => handleChangeCurrentMonth(moment(currentMonth).subtract(1, 'M'))}>
            <Icon
              icon={ARROW_LEFT}/>
          </GoToPreviousMonth>
          <CurrentMonth>
            {currentMonth.format('MMMM YYYY')}
          </CurrentMonth>
          <GoToNextMonth
            onClick={() => handleChangeCurrentMonth(moment(currentMonth).add(1, 'M'))}>
            <Icon
              icon={ARROW_RIGHT}/>
          </GoToNextMonth>
        </DatepickerHeader>
        <DatepickerDates>
          {currentMonthDatesArray.map((currentDate, index) =>
            <DatepickerDate
              key={index}
              isSelected={isValueInCurrentMonth && valueDate === currentDate}
              onClick={() => updateCellValue(moment(currentMonth).date(currentDate).format('MM/DD/YYYY'))}
              userColorPrimary={userColorPrimary}>
              {currentDate}
            </DatepickerDate>
          )}
        </DatepickerDates>
      </DropdownContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellDatetimeProps {
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
    background-color: ${ ({ isSelected, userColorPrimary }: IDatePickerDate) => isSelected ? userColorPrimary : 'rgb(240, 240, 240)'};
  }
`
interface IDatePickerDate {
  isSelected: boolean
  userColorPrimary: string
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellDatetime
