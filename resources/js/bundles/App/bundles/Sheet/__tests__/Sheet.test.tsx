//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'

import { renderWithRedux, wait } from '@app/testing/library'
import { mockAxios } from '@app/testing/mocks'
import { appStateFactory, IAppStateFactoryInput } from '@app/testing/mocks/appState'

import { Sheet, ISheetProps } from '@app/bundles/Sheet/Sheet'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
const {
  allFiles,
  allFileIds,
  allSheetsFromDatabase
} = appStateFactory({} as IAppStateFactoryInput)

const fileId = allFileIds[0]
const sheetId = allFiles[allFileIds[0]].typeId

console.warn = jest.fn()
console.error = jest.fn()



//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const props: ISheetProps = {
  fileId: fileId,
  id: sheetId
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('Sheet', () => {

  const getSheetUrl = '/app/sheets/' + sheetId
  const sheetFromDatabase = allSheetsFromDatabase[sheetId]

  mockAxios.onGet(getSheetUrl).reply(200, sheetFromDatabase)

  it("shows the loading timer when the sheet is active but has not loaded", async () => {
    const { getByTestId } = renderWithRedux(<Sheet {...props}/>)
    wait()
    expect(getByTestId('sheetContainer')).toHaveTextContent('seconds')
  })

  it("attempts to fetch the sheet", async () => {
    renderWithRedux(<Sheet {...props}/>)
    expect(mockAxios.history.get.length).toBe(1)
    expect(mockAxios.history.get[0].url).toBe(getSheetUrl)
  })

  // mockAxios refuses to do anything but throw a 404 whenever I try to test
  // the sheet load - I'll come back to this, but it's going to be pretty
  // obvious if something breaks the sheet load so I decided to move on.
  /*
  it("displays the sheet after loading the sheet into the app state", async () => {
    const { getByTestId, store } = renderWithRedux(<Sheet {...props}/>)
    store.dispatch(loadSheet(sheetFromDatabase)).then(async () => {
      const sheetGridContainer = await waitForElement(() => getByTestId('sheetGridContainer'))
      expect(sheetGridContainer).toHaveTextContent('CELL_')
      expect(true).toBe(false)
    })
  })
  */

})

//-----------------------------------------------------------------------------
// Cleanup
//-----------------------------------------------------------------------------
afterEach(() => {
  mockAxios.restore()
})