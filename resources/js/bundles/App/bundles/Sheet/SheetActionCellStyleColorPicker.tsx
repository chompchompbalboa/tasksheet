//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { CirclePicker } from 'react-color'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { ARROW_DOWN, RESET_COLOR } from '@app/assets/icons'

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
  sheetStylesColorReference,
  updateSheetStyles,
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

  // Local Color
  const [ localColor, setLocalColor ] = useState('rgb(0,0,0)')

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
      const nextSheetStylesColorReference = { ...sheetStylesColorReference }

      for(let rowIndex = rangeStartRowIndex; rowIndex <= rangeEndRowIndex; rowIndex++) {
        const rowId = sheetVisibleRows[rowIndex]
        if(rowId !== 'ROW_BREAK') {
          const row = rows[rowId]
          for(let columnIndex = rangeStartColumnIndex; columnIndex <= rangeEndColumnIndex; columnIndex++) {
            const columnId = sheetVisibleColumns[columnIndex]
            if(columnId !== 'COLUMN_BREAK') {
              const cellId = row.cells[columnId]
              nextSheetStylesSet.add(cellId)
              nextSheetStylesColorReference[cellId] = localColor
            }
          }
        }
      }
      updateSheetStyles(nextSheetStylesSet, nextSheetStylesColorReference)
    }
    // Cell
    else if(rangeStartCellId) {
      const nextSheetStylesSet = new Set([ ...sheetStylesSet ])
      const nextSheetStylesColorReference = { ...sheetStylesColorReference }
      nextSheetStylesSet.add(rangeStartCellId)
      nextSheetStylesColorReference[rangeStartCellId] = localColor
      updateSheetStyles(nextSheetStylesSet, nextSheetStylesColorReference)
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
          currentColor={localColor}/>
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
        <ResetColor>
          <Icon 
            icon={RESET_COLOR}
            size="1.25rem"/>
          &nbsp;&nbsp;Reset
        </ResetColor>
        <CirclePicker
          color={localColor}
          onChange={color => setLocalColor(color.hex)}/>
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
  sheetStylesColorReference: { [cellId: string]: string }
  updateSheetStyles(nextSheetStylesSet: Set<string>, nextSheetStylesColorReference: { [cellId: string ]: string }): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
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
  left: 0;
  top: 100%;
  padding: 1rem;
  border-radius: 5px;
  background-color: rgb(250, 250, 250);
  box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.5);
`
interface IDropdown {
  isDropdownVisible: boolean
}

const ResetColor = styled.div`
  width: 100%;
  padding: 0.375rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  &:hover {
    background-color: rgb(200, 200, 200);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleColorPicker
