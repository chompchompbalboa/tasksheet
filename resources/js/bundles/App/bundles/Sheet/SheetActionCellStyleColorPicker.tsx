//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN } from '@app/assets/icons'

import { AppState } from '@app/state'
import { Sheet } from '@app/state/sheet/types'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleColorPicker = ({
  sheetId,
  icon,
  sheetStylesSet,
  updateSheetStylesSet
}: SheetActionCellStyleColorPickerProps) => {
  
  // Redux
  const userColorPrimary = useSelector((state: AppState) => state.user.color.primary)
  const rows = useSelector((state: AppState) => state.sheet.rows)
  const selections = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].selections)
  const sheetVisibleColumns = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].visibleColumns)
  const sheetVisibleRows = useSelector((state: AppState) => state.sheet.sheets && state.sheet.sheets[sheetId] && state.sheet.sheets[sheetId].visibleRows)
  
  // Dropdown
  const dropdown = useRef(null)
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)
  useEffect(() => {
    if(isDropdownVisible) { addEventListener('click', closeOnClickOutside) }
    else { removeEventListener('click', closeOnClickOutside) }
    return () => removeEventListener('click', closeOnClickOutside)
  })
  const closeOnClickOutside = (e: MouseEvent) => {
    if(!dropdown.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }
  
  const addOrDeleteFromSet = sheetStylesSet && sheetStylesSet.has(selections.rangeStartCellId) ? 'DELETE' : 'ADD'

  const handleContainerClick = () => {
    const {
      rangeStartCellId,
      rangeStartColumnId,
      rangeStartRowId,
      rangeEndCellId,
      rangeEndColumnId,
      rangeEndRowId,
    } = selections

    // Range
    if(rangeEndCellId) {
      const rangeStartColumnIndex = sheetVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeStartColumnId)
      const rangeStartRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeStartRowId)
      const rangeEndColumnIndex = sheetVisibleColumns.findIndex(visibleColumnId => visibleColumnId === rangeEndColumnId)
      const rangeEndRowIndex = sheetVisibleRows.findIndex(visibleRowId => visibleRowId === rangeEndRowId)
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])

      for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
        const rowId = sheetVisibleRows[rowIndex]
        if(rowId !== 'ROW_BREAK') {
          const row = rows[rowId]
          for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
            const columnId = sheetVisibleColumns[columnIndex]
            if(columnId !== 'COLUMN_BREAK') {
              const cellId = row.cells[columnId]
              addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(cellId) : nextSheetStylesSet.delete(cellId)
            }
          }
        }
      }
      updateSheetStylesSet(nextSheetStylesSet)
    }
    // Cell
    else if(rangeStartCellId) {
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
      addOrDeleteFromSet === 'ADD' ? nextSheetStylesSet.add(rangeStartCellId) : nextSheetStylesSet.delete(rangeStartCellId)
      updateSheetStylesSet(nextSheetStylesSet)
    }
  }

  return (
    <Container>
      <CurrentColorContainer
        containerBackgroundColor={userColorPrimary}
        onClick={handleContainerClick}>
        <Icon 
          icon={icon}/>
        <CurrentColor
          currentColor='red'/>
      </CurrentColorContainer>
      <DropdownToggle
        dropdownToggleBackgroundColor={userColorPrimary}
        onClick={() => setIsDropdownVisible(true)}>
        <Icon 
          icon={ARROW_DOWN}/>
      </DropdownToggle>
      <Dropdown
        ref={dropdown}
        isDropdownVisible={isDropdownVisible}>
        Dropdown
      </Dropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleColorPickerProps {
  sheetId: Sheet['id']
  icon: string
  sheetStylesSet: Set<string>
  updateSheetStylesSet(nextSheetStylesSet: Set<string>): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  margin-right: 0.375rem;
  cursor: pointer;  
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(210, 210, 210);
  color: rgb(80, 80, 80);
  text-decoration: none;
  border-radius: 3px;
`

const CurrentColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.325rem 0.4rem;
  transition: all 0.05s;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  &:hover {
    background-color: ${ ({ containerBackgroundColor }: IContainer) => containerBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IContainer {
  containerBackgroundColor: string
}

const CurrentColor = styled.div`
  width: 100%;
  height: 0.15rem;
  background-color: ${ ({ currentColor }: ICurrentColor ) => currentColor};
`
interface ICurrentColor {
  currentColor: string
}

const DropdownToggle = styled.div`
  cursor: pointer;
  padding: 0.4rem 0.1rem;
  border-left: 1px solid rgb(170, 170, 170);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.05s;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  &:hover {
    background-color: ${ ({ dropdownToggleBackgroundColor }: IDropdownToggle) => dropdownToggleBackgroundColor};
    color: rgb(240, 240, 240);
  }
`
interface IDropdownToggle {
  dropdownToggleBackgroundColor: string
}

const Dropdown = styled.div`
  display: ${ ({ isDropdownVisible }: IDropdown) => isDropdownVisible ? 'block' : 'none' };
  position: absolute;
  margin-left: 0.375rem;
  top: 100%;
  background-color: white;
`
interface IDropdown {
  isDropdownVisible: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleColorPicker
