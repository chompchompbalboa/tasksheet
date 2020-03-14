//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'

import { cleanup, fireEvent, renderWithRedux } from '@/testing/library'
import { 
  createMockStore,
  getCellAndCellProps,
  getMockAppStateByTasksheetSubscriptionType,
  getMockAppStateByUsersFilePermissionRole,
  mockAppState 
} from '@/testing/mocks'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import { SheetCell } from '@desktop/Sheet/SheetCell'
import Messenger from '@desktop/Messenger/Messenger'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  folder: {
    allFolders,
    allFiles
  },
  sheet: {
    allSheets,
    allSheetViews
  },
  user: {
    color: {
      secondary: userColorSecondary
    }
  }
} = mockAppState

const folderId = Object.keys(allFolders)[0]
const fileId = allFolders[folderId].files[0]
const file = allFiles[fileId]
const sheetId = file.typeId
const sheet = allSheets[sheetId]
const activeSheetView = allSheetViews[sheet.activeSheetViewId]

const cellIsSelectedBoxShadow = 'inset 0px 0px 0px 2px ' + userColorSecondary

console.warn = jest.fn()

afterEach(cleanup)

jest.setTimeout(10000)

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetCell', () => {
  it("renders without crashing", async () => {
    const { cell, props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCell')).toHaveTextContent(cell.value)
  })

  it("correctly renders SheetCellString", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'STRING' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellString')).toBeTruthy()
  })

  it("correctly renders SheetCellNumber", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'NUMBER' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellNumber')).toBeTruthy()
  })

  it("correctly renders SheetCellBoolean", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'BOOLEAN' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellBoolean')).toBeTruthy()
  })

  it("correctly renders SheetCellDatetime", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'DATETIME' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellDatetime')).toBeTruthy()
  })

  it("correctly renders SheetCellPhotos", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'PHOTOS' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellPhotos')).toBeTruthy()
  })

  it("correctly renders SheetCellFiles", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1, cellTypeOverride: 'FILES' })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellFiles')).toBeTruthy()
  })

  it("changes background color on hover", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    const Container = getByTestId('SheetCell')
    const initialBackgroundColor = Container.style.backgroundColor
    fireEvent.mouseOver(Container)
    expect(Container).not.toHaveStyleRule('background-color', initialBackgroundColor)
  })

  it("selects when clicked", async () => {
    const { props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCell')).toHaveStyleRule('box-shadow', 'none')
    fireEvent.mouseDown(getByTestId('SheetCell'))
    expect(getByTestId('SheetCell')).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
  })

  it("when another cell is clicked, changes the selected cell to the clicked cell", async () => {
    const { props: R1C1CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { props: R2C2CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C1Container = getAllByTestId('SheetCell')[0]
    const R2C2Container = getAllByTestId('SheetCell')[1]
    
    expect(R1C1Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')

    fireEvent.mouseDown(R1C1Container)
    expect(R1C1Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    
    fireEvent.mouseDown(R2C2Container)
    expect(R1C1Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
  })

  it("changes the selected cell in response to the arrow keys", async () => {
    const { props: R1C2CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 2 })
    const { props: R2C1CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 1 })
    const { props: R2C2CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C2CellProps}/>
        <SheetCell {...R2C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C2Container = getAllByTestId('SheetCell')[0]
    const R2C1Container = getAllByTestId('SheetCell')[1]
    const R2C2Container = getAllByTestId('SheetCell')[2]

    fireEvent.mouseDown(R2C2Container)
    expect(R2C2Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.keyDown(R2C2Container, { key: 'ArrowLeft'})
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C1Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.keyDown(R2C1Container, { key: 'ArrowRight'})
    expect(R2C1Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.keyDown(R2C2Container, { key: 'ArrowUp'})
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R1C2Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.keyDown(R1C2Container, { key: 'ArrowDown'})
    expect(R1C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
  })

  it("doesn't change the selected cell in response to the arrow keys if the update would move the selection to a cell that doesn't exist", async () => {    
    const { props: RFirstCFirstCellProps } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { props: RFirstCLastCellProps } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: activeSheetView.visibleColumns.length })
    const { props: RLastCFirstCellProps } = getCellAndCellProps({ sheetId: sheetId, row: sheet.visibleRows.length - 1, column: 1 })
    const { props: RLastCLastCellProps } = getCellAndCellProps({ sheetId: sheetId, row: sheet.visibleRows.length - 1, column: activeSheetView.visibleColumns.length })

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...RFirstCFirstCellProps}/>
        <SheetCell {...RFirstCLastCellProps}/>
        <SheetCell {...RLastCFirstCellProps}/>
        <SheetCell {...RLastCLastCellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const Containers = getAllByTestId('SheetCell')
    const RFirstCFirstContainer = Containers[0]
    const RFirstCLastContainer = Containers[1]
    const RLastCFirstContainer = Containers[2]
    const RLastCLastContainer = Containers[3]

    fireEvent.mouseDown(RFirstCFirstContainer)
    expect(RFirstCFirstContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RFirstCFirstContainer, { key: 'ArrowLeft'})
    expect(RFirstCFirstContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RFirstCFirstContainer, { key: 'ArrowUp'})
    expect(RFirstCFirstContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.mouseDown(RFirstCLastContainer)
    expect(RFirstCLastContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RFirstCLastContainer, { key: 'ArrowRight'})
    expect(RFirstCLastContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RFirstCLastContainer, { key: 'ArrowUp'})
    expect(RFirstCLastContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.mouseDown(RLastCFirstContainer)
    expect(RLastCFirstContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RLastCFirstContainer, { key: 'ArrowLeft'})
    expect(RLastCFirstContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RLastCFirstContainer, { key: 'ArrowDown'})
    expect(RLastCFirstContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)

    fireEvent.mouseDown(RLastCLastContainer)
    expect(RLastCLastContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    fireEvent.keyDown(RLastCLastContainer, { key: 'ArrowRight'})
    expect(RLastCLastContainer).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
  })

  it("selects a range when shift-clicked", async () => {
    const { props: R1C1CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { props: R2C2CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })
    
    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C1Container = getAllByTestId('SheetCell')[0]
    const R1C1SheetRange = getAllByTestId('SheetCellSheetRange')[0]
    const R2C2Container = getAllByTestId('SheetCell')[1]
    const R2C2SheetRange = getAllByTestId('SheetCellSheetRange')[1]
    
    expect(R1C1Container).toHaveStyleRule('box-shadow', 'none')
    expect(R1C1SheetRange).toHaveStyleRule('background-color', 'transparent')
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2SheetRange).toHaveStyleRule('background-color', 'transparent')

    fireEvent.mouseDown(R1C1Container)
    expect(R1C1Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    expect(R1C1SheetRange).toHaveStyleRule('background-color', 'transparent')
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2SheetRange).toHaveStyleRule('background-color', 'transparent')
    
    fireEvent.mouseDown(R2C2Container, { shiftKey: true })
    expect(R1C1Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    expect(R1C1SheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2SheetRange).toHaveStyleRule('background-color', userColorSecondary)
  })

  it("deselects the range when a cell outside the range is clicked", async () => {
    const { props: R1C1CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { props: R2C2CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 2, column: 2 })
    const { props: R3C3CellProps } = getCellAndCellProps({ sheetId: sheetId, row: 3, column: 3 })

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
        <SheetCell {...R3C3CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C1Container = getAllByTestId('SheetCell')[0]
    const R1C1SheetRange = getAllByTestId('SheetCellSheetRange')[0]
    const R2C2Container = getAllByTestId('SheetCell')[1]
    const R2C2SheetRange = getAllByTestId('SheetCellSheetRange')[1]
    const R3C3Container = getAllByTestId('SheetCell')[2]

    fireEvent.mouseDown(R1C1Container)
    fireEvent.mouseDown(R2C2Container, { shiftKey: true })
    expect(R1C1Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
    expect(R1C1SheetRange).toHaveStyleRule('background-color', userColorSecondary)
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2SheetRange).toHaveStyleRule('background-color', userColorSecondary)

    fireEvent.mouseDown(R3C3Container)
    expect(R1C1Container).toHaveStyleRule('box-shadow', 'none')
    expect(R1C1SheetRange).toHaveStyleRule('background-color', 'transparent')
    expect(R2C2Container).toHaveStyleRule('box-shadow', 'none')
    expect(R2C2SheetRange).toHaveStyleRule('background-color', 'transparent')
    expect(R3C3Container).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
  })

  it("displays an error message when a user with an expired subscription tries to edit a cell", () => {
    const { props: R1C1Props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { getByTestId, queryByText } = renderWithRedux(
      <>
        <SheetCell {...R1C1Props}/>
        <Messenger />
      </>
    , { store: createMockStore(getMockAppStateByTasksheetSubscriptionType('TRIAL_EXPIRED')) })
    const R1C1Container = getByTestId('SheetCellString')
    fireEvent.doubleClick(R1C1Container)
    expect(queryByText(SUBSCRIPTION_EXPIRED_MESSAGE.message)).toBeTruthy()
  })

  it("displays an error message when a user without editing permission tries to edit a cell", () => {
    const { props: R1C1Props } = getCellAndCellProps({ sheetId: sheetId, row: 1, column: 1 })
    const { getByTestId, queryByText } = renderWithRedux(
      <>
        <SheetCell {...R1C1Props}/>
        <Messenger />
      </>
    , { store: createMockStore(getMockAppStateByUsersFilePermissionRole('VIEWER')) })
    const R1C1Container = getByTestId('SheetCellString')
    fireEvent.doubleClick(R1C1Container)
    expect(queryByText(USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE.message)).toBeTruthy()
  })
})
