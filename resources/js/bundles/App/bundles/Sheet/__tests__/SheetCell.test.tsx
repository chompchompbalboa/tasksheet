//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import 'jest-styled-components'
import '@testing-library/jest-dom/extend-expect'

import { cleanup, fireEvent, renderWithRedux } from '@app/testing/library'
import { createMockStore, mockAppState } from '@app/testing/mocks'

import { SheetCell, ISheetCellProps } from '@app/bundles/Sheet/SheetCell'

//-----------------------------------------------------------------------------
// Mocks / Setup
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
const getCellAndCellPropsByRowAndColumn = (rowIndexPlusOne: number, columnIndexPlusOne: number) => {

  const columnId = sheet.visibleColumns[columnIndexPlusOne - 1]
  const column = allSheetColumns[columnId]
  const columnType = allSheetColumnTypes[column.typeId]
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
})
