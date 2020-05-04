//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'

import { ARROW_LEFT, ARROW_RIGHT } from '@/assets/icons'

import { dateValidator as defaultDateValidator } from '@desktop/Sheet/SheetCellDatetime'

import { IAppState } from '@/state'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Datepicker = ({
  dateValidator = defaultDateValidator,
  handleEditing,
  isVisible = true,
  value,
}: IDatepickerProps) => {

  // Redux
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  // Is Value Valid Date
  const isValueValidDate = dateValidator(value)

  // State
  const [ currentMonth, setCurrentMonth ] = useState(isValueValidDate ? moment(value) : moment())

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

  return (
    <Container
      data-testid="Datepicker"
      isVisible={isVisible}>
      <DatepickerHeader>
        <GoToPreviousMonth
          data-testid="DatepickerGoToPreviousMonth"
          onClick={() => setCurrentMonth(moment(currentMonth).subtract(1, 'M'))}>
          <Icon
            icon={ARROW_LEFT}/>
        </GoToPreviousMonth>
        <CurrentMonth>
          {currentMonth.format('MMMM YYYY')}
        </CurrentMonth>
        <GoToNextMonth
          data-testid="DatepickerGoToNextMonth"
          onClick={() => setCurrentMonth(moment(currentMonth).add(1, 'M'))}>
          <Icon
            icon={ARROW_RIGHT}/>
        </GoToNextMonth>
      </DatepickerHeader>
      <DatepickerDates
        data-testid="DatepickerDates">
        {currentMonthDatesArray.map((currentDate, index) =>
          <DatepickerDate
            key={index}
            isEmpty={currentDate === null}
            isSelected={isValueInCurrentMonth && valueDate === currentDate}
            onClick={currentDate !== null ? () => handleEditing(moment(currentMonth).date(currentDate).format('MM/DD/YYYY')) : () => null}
            userColorPrimary={userColorPrimary}>
            {currentDate}
          </DatepickerDate>
        )}
      </DatepickerDates>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface IDatepickerProps {
  dateValidator?(date: any): boolean
  handleEditing(nextCellValue: string): void
  isVisible?: boolean
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: ${ ({ isVisible }: IDropdownContainer) => isVisible ? 'block' : 'none' };
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`
interface IDropdownContainer {
  isVisible: boolean
}

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
export default Datepicker
