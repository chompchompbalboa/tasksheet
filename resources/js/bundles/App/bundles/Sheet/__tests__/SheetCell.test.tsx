//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'

import { cleanup, fireEvent, renderWithRedux } from '@app/testing/library'
import { createMockStore, mockAppState } from '@app/testing/mocks'

import { SheetCell, ISheetCellProps } from '@app/bundles/Sheet/SheetCell'
import { ISheetColumnType } from '@/bundles/App/state/sheet/types'

//-----------------------------------------------------------------------------
// Setup
//-----------------------------------------------------------------------------
const {
  folder: {
    folders,
    files
  },
  sheet: {
    allSheets,
    allSheetRows,
    allSheetColumns,
    allSheetColumnTypes,
    allSheetCells
  },
  user: {
    color: {
      secondary: userColorSecondary
    }
  }
} = mockAppState

const folderId = Object.keys(folders)[0]
const fileId = folders[folderId].files[0]
const file = files[fileId]
const sheetId = file.typeId
const sheet = allSheets[sheetId]

const cellIsSelectedBoxShadow = 'inset 0px 0px 0px 2px ' + userColorSecondary

console.warn = jest.fn()

afterEach(cleanup)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
const getCellAndCellPropsByRowAndColumn = (rowIndexPlusOne: number, columnIndexPlusOne: number, columnTypeOverride?: ISheetColumnType['id']) => {

  const columnId = sheet.visibleColumns[columnIndexPlusOne - 1]
  const column = allSheetColumns[columnId]
  const columnType = allSheetColumnTypes[columnTypeOverride || column.typeId]
  const rowId = sheet.visibleRows[rowIndexPlusOne - 1]
  const row = allSheetRows[rowId]
  const cell = allSheetCells[row.cells[column.id]]
  const props: ISheetCellProps = {
    sheetId: sheetId,
    cellId: cell.id,
    columnType: columnType,
    style: {}
  }
  return {
    cell,
    props
  }
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------
describe('SheetCell', () => {
  it("renders without crashing", async () => {
    const { cell, props } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    expect(getByTestId('Container')).toHaveTextContent(cell.value)
  })

  it("correctly renders SheetCellString", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'STRING')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellString')).toBeTruthy()
  })

  it("correctly renders SheetCellNumber", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'NUMBER')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellNumber')).toBeTruthy()
  })

  it("correctly renders SheetCellBoolean", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'BOOLEAN')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellBoolean')).toBeTruthy()
  })

  it("correctly renders SheetCellDatetime", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'DATETIME')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellDatetime')).toBeTruthy()
  })

  it("correctly renders SheetCellDropdown", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'DROPDOWN')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellDropdown')).toBeTruthy()
  })

  it("correctly renders SheetCellPhotos", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'PHOTOS')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellPhotos')).toBeTruthy()
  })

  it("correctly renders SheetCellFiles", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1, 'FILES')
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/> ,{ store: createMockStore(mockAppState) })
    expect(getByTestId('SheetCellFiles')).toBeTruthy()
  })

  it("changes background color on hover", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    const Container = getByTestId('Container')
    const initialBackgroundColor = Container.style.backgroundColor
    fireEvent.mouseOver(Container)
    expect(Container).not.toHaveStyleRule('background-color', initialBackgroundColor)
  })

  it("selects when clicked", async () => {
    const { props } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { getByTestId } = renderWithRedux(<SheetCell {...props}/>, { store: createMockStore(mockAppState) })
    expect(getByTestId('Container')).toHaveStyleRule('box-shadow', 'none')
    fireEvent.mouseDown(getByTestId('Container'))
    expect(getByTestId('Container')).toHaveStyleRule('box-shadow', cellIsSelectedBoxShadow)
  })

  it("when another cell is clicked, changes the selected cell to the clicked cell", async () => {
    const { props: R1C1CellProps } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { props: R2C2CellProps } = getCellAndCellPropsByRowAndColumn(2, 2)

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C1Container = getAllByTestId('Container')[0]
    const R2C2Container = getAllByTestId('Container')[1]
    
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
    const { props: R1C2CellProps } = getCellAndCellPropsByRowAndColumn(1, 2)
    const { props: R2C1CellProps } = getCellAndCellPropsByRowAndColumn(2, 1)
    const { props: R2C2CellProps } = getCellAndCellPropsByRowAndColumn(2, 2)

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C2CellProps}/>
        <SheetCell {...R2C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C2Container = getAllByTestId('Container')[0]
    const R2C1Container = getAllByTestId('Container')[1]
    const R2C2Container = getAllByTestId('Container')[2]

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
    const { props: RFirstCFirstCellProps } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { props: RFirstCLastCellProps } = getCellAndCellPropsByRowAndColumn(1, sheet.visibleColumns.length)
    const { props: RLastCFirstCellProps } = getCellAndCellPropsByRowAndColumn(sheet.visibleRows.length, 1)
    const { props: RLastCLastCellProps } = getCellAndCellPropsByRowAndColumn(sheet.visibleRows.length, sheet.visibleColumns.length)

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...RFirstCFirstCellProps}/>
        <SheetCell {...RFirstCLastCellProps}/>
        <SheetCell {...RLastCFirstCellProps}/>
        <SheetCell {...RLastCLastCellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const Containers = getAllByTestId('Container')
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
    const { props: R1C1CellProps } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { props: R2C2CellProps } = getCellAndCellPropsByRowAndColumn(2, 2)

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C1Container = getAllByTestId('Container')[0]
    const R1C1SheetRange = getAllByTestId('SheetRange')[0]
    const R2C2Container = getAllByTestId('Container')[1]
    const R2C2SheetRange = getAllByTestId('SheetRange')[1]
    
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
    const { props: R1C1CellProps } = getCellAndCellPropsByRowAndColumn(1, 1)
    const { props: R2C2CellProps } = getCellAndCellPropsByRowAndColumn(2, 2)
    const { props: R3C3CellProps } = getCellAndCellPropsByRowAndColumn(3, 3)

    const { getAllByTestId } = renderWithRedux(
      <>
        <SheetCell {...R1C1CellProps}/>
        <SheetCell {...R2C2CellProps}/>
        <SheetCell {...R3C3CellProps}/>
      </>
    ,{ store: createMockStore(mockAppState) })

    const R1C1Container = getAllByTestId('Container')[0]
    const R1C1SheetRange = getAllByTestId('SheetRange')[0]
    const R2C2Container = getAllByTestId('Container')[1]
    const R2C2SheetRange = getAllByTestId('SheetRange')[1]
    const R3C3Container = getAllByTestId('Container')[2]

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

  it("SheetCellString begins editing the cell when double clicked", async () => {
    const { cell, props } = getCellAndCellPropsByRowAndColumn(1, 1, 'STRING')
    const { getByText, getByTestId, queryByTestId } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringTextarea')).toBeNull()
    fireEvent.doubleClick(getByText(cell.value))
    expect(getByTestId('SheetCellStringTextarea')).toBeTruthy()
  })

  it("SheetCellNumber begins editing the cell when double clicked", async () => {
    const { cell, props } = getCellAndCellPropsByRowAndColumn(1, 1, 'NUMBER')
    const { getByText, getByTestId, queryByTestId } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellNumberInput')).toBeNull()
    fireEvent.doubleClick(getByText(cell.value))
    expect(getByTestId('SheetCellNumberInput')).toBeTruthy()
  })

  it("SheetCellDatetime begins editing the cell when double clicked", async () => {
    const { cell, props } = getCellAndCellPropsByRowAndColumn(1, 1, 'DATETIME')
    const { getByText, getByTestId, queryByTestId } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellStringTextarea')).toBeNull()
    fireEvent.doubleClick(getByText(cell.value))
    expect(getByTestId('SheetCellStringTextarea')).toBeTruthy()
  })

  it("SheetCellDropdown begins editing the cell and displays the dropdown when double clicked", async () => {
    const { cell, props } = getCellAndCellPropsByRowAndColumn(1, 1, 'DROPDOWN')
    const { getByText, getByTestId, queryByTestId } = renderWithRedux(<SheetCell {...props}/>,{ store: createMockStore(mockAppState) })
    expect(queryByTestId('SheetCellDropdownTextarea')).toBeNull()
    expect(queryByTestId('SheetCellDropdownDropdown')).toBeNull()
    fireEvent.doubleClick(getByText(cell.value))
    expect(getByTestId('SheetCellDropdownTextarea')).toBeTruthy()
    expect(getByTestId('SheetCellDropdownDropdown')).toBeTruthy()
  })
})
