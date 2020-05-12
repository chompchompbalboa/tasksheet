//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import axiosMock from 'axios'
import moment from 'moment'
import 'jest-styled-components'

import { 
  fireEvent,
  renderWithRedux,
  within
} from '@/testing/library'
import { 
  createMockStore, 
  mockAppState
} from '@/testing/mocks'

import { IAppState } from '@/state'

import Messenger from '@desktop/Messenger/Messenger'
import SheetHeaderGanttDates, { ISheetHeaderGanttDates } from '@/bundles/Desktop/Sheet/SheetHeaderGanttDates'
import { flushPromises } from '@/testing/utils'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  sheet: {
    allSheets,
    allSheetGantts
  }
} = mockAppState

const sheetId = Object.keys(allSheets)[0]
const sheetGanttId = Object.keys(allSheetGantts)[0]

console.warn = jest.fn()

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetHeaderGanttDates = {
  sheetId: sheetId,
  sheetGanttId
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetHeaderGanttDates', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sheetHeaderGantt = (appState: IAppState = mockAppState) => {
    const {
      getAllByTestId,
      getByText,
      queryByText,
      store: {
        getState
      }
    } = renderWithRedux(
      <>
        <SheetHeaderGanttDates {...props}/>
        <Messenger />
      </>
    , { store: createMockStore(appState) })
    const sheetGanttStartDateValue = () => moment(getState().sheet.allSheetGantts[sheetGanttId].startDate).format('MM/DD/YY')
    const sheetGanttEndDateValue = () => moment(getState().sheet.allSheetGantts[sheetGanttId].endDate).format('MM/DD/YY')
    const sheetGanttStartDate = getByText(sheetGanttStartDateValue())
    const sheetGanttEndDate = getByText(sheetGanttEndDateValue())
    const sheetGanttStartDateDatepicker = getAllByTestId("Datepicker")[0]
    const sheetGanttEndDateDatepicker = getAllByTestId("Datepicker")[1]
    return {
      getState,
      getByText,
      sheetGanttStartDate,
      sheetGanttStartDateDatepicker,
      sheetGanttStartDateValue,
      sheetGanttEndDate,
      sheetGanttEndDateDatepicker,
      sheetGanttEndDateValue,
      queryByText
    }
  }

  it("displays the gantt's start date correctly", async () => {
    const { sheetGanttStartDate } = sheetHeaderGantt()
    expect(sheetGanttStartDate).toBeTruthy()
  })

  it("displays the gantt's end date correctly", async () => {
    const { sheetGanttEndDate } = sheetHeaderGantt()
    expect(sheetGanttEndDate).toBeTruthy()
  })

  it("displays a datepicker when the gantt's start date is clicked", async () => {
    const { sheetGanttStartDate, sheetGanttStartDateDatepicker } = sheetHeaderGantt()
    fireEvent.click(sheetGanttStartDate)
    expect(sheetGanttStartDateDatepicker).toHaveStyleRule('display', 'block')
  })

  it("displays a datepicker when the gantt's end date is clicked", async () => {
    const { sheetGanttEndDate, sheetGanttEndDateDatepicker } = sheetHeaderGantt()
    fireEvent.click(sheetGanttEndDate)
    expect(sheetGanttEndDateDatepicker).toHaveStyleRule('display', 'block')
  })

  it("changes the gantt's start date when a date in selected in the datepicker", async () => {
    const { sheetGanttStartDate, sheetGanttStartDateDatepicker, sheetGanttStartDateValue } = sheetHeaderGantt()
    fireEvent.click(sheetGanttStartDate)
    const nextGanttStartDateDay = moment().day() === 15 ? '20' : '15'
    const nextGanttStartDateDayInDatepicker = within(sheetGanttStartDateDatepicker).getByText(nextGanttStartDateDay)
    expect(sheetGanttStartDateValue()).not.toContain(nextGanttStartDateDay)
    fireEvent.click(nextGanttStartDateDayInDatepicker)
    await flushPromises()
    expect(sheetGanttStartDateValue()).toContain(nextGanttStartDateDay)
    expect(axiosMock.patch).toHaveBeenCalledTimes(1)
  })

  it("changes the gantt's end date when a date in selected in the datepicker", async () => {
    const { sheetGanttEndDate, sheetGanttEndDateDatepicker, sheetGanttEndDateValue } = sheetHeaderGantt()
    fireEvent.click(sheetGanttEndDate)
    const nextGanttEndDateDay = moment().day() === 15 ? '20' : '15'
    const nextGanttEndDateDayInDatepicker = within(sheetGanttEndDateDatepicker).getByText(nextGanttEndDateDay)
    expect(sheetGanttEndDateValue()).not.toContain(nextGanttEndDateDay)
    fireEvent.click(nextGanttEndDateDayInDatepicker)
    await flushPromises()
    expect(sheetGanttEndDateValue()).toContain(nextGanttEndDateDay)
    expect(axiosMock.patch).toHaveBeenCalledTimes(1)
  })
})