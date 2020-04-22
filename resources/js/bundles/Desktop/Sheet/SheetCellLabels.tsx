//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { orderBy } from 'lodash'
 
import { IAppState } from '@/state'
import { ISheetCellTypesSharedProps } from '@desktop/Sheet/SheetCell'

import { 
  addSheetColumnAllCellValue,
  createSheetCellChange,
  createSheetCellLabel,
  updateSheet,
  updateSheetCell,
  updateSheetCellValues
} from '@/state/sheet/actions'

import SheetCellContainer from '@desktop/Sheet/SheetCellContainer'
import SheetCellLabelsLabel from '@desktop/Sheet/SheetCellLabelsLabel'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellLabels = ({
  sheetId,
  columnId,
  cell,
  isCellInRange,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {
  
  // Refs
  const input = useRef(null)

  // Redux
  const dispatch = useDispatch()
  const sheetCellLabels = useSelector((state: IAppState) => state.sheet.allSheetLabels && state.sheet.allSheetCellLabels && state.sheet.allSheetCellLabels[cell.id] && state.sheet.allSheetCellLabels[cell.id].map(labelId => {
    return state.sheet.allSheetLabels[labelId]
  }))
  
  // State
  const [ sheetCellPreviousValue, setSheetCellPreviousValue ] = useState(null)

  // Effects
  useEffect(() => {
    if(cell.isCellEditing && input && input.current) {
      input.current.focus()
    }
  }, [ cell.isCellEditing ])
  
  // Begin Editing
  const beginEditing = (value: string = null) => {
    const nextSheetCellValue = value === null ? cell.value : value
    setSheetCellPreviousValue(cell.value)
    dispatch(updateSheet(sheetId, { isCellEditing: true }, true))
    if(isCellInRange) {
      dispatch(updateSheetCell(cell.id, { isCellEditing: true }, null, true ))
      dispatch(updateSheetCellValues(sheetId, nextSheetCellValue))
    }
    else {
      dispatch(updateSheetCell(cell.id, { isCellEditing: true, value: nextSheetCellValue }, null, true ))
    }
  }
  
  // Complete Editing
  const completeEditing = () => {
    dispatch(updateSheetCell(cell.id, { isCellEditing: false }, null, true))
    dispatch(updateSheet(sheetId, { isCellEditing: false }, true))
    setTimeout(() => {
      setSheetCellPreviousValue(null)
      if(cell.value !== sheetCellPreviousValue && cell.value !== '') {
        dispatch(addSheetColumnAllCellValue(columnId, cell.value))
        dispatch(createSheetCellLabel(sheetId, cell.id, cell.value, sheetCellPreviousValue, getFullCellValue(cell.value)))
        if(isTrackCellChanges) {
          dispatch(createSheetCellChange(sheetId, cell.id, 'New Label: ' + cell.value))
        }
      }
    }, 25)
  }
  
  // Handle Editing
  const handleEditing = (e: ChangeEvent<HTMLInputElement>) => {
    const nextSheetCellValue = e.target.value
    if(isCellInRange) {
      dispatch(updateSheetCellValues(sheetId, nextSheetCellValue))
    }
    else {
      dispatch(updateSheetCell(cell.id, { value: nextSheetCellValue }, null, true))
    }
  }

  // Get Full Cell Value
  const getFullCellValue = (cellValue: string) => {
    let fullCellValue = ''
    sheetCellLabels && orderBy(sheetCellLabels, [ 'value' ]).forEach(sheetLabel => {
      fullCellValue = fullCellValue + (sheetLabel.value + ";")
    })
    fullCellValue = fullCellValue + (cellValue + ";")
    return fullCellValue
  }

  // Get Visible Cell Value
  const getVisibleCellValue = (cellValue: string) => {
    let visibleCellValue = cellValue || ''
    sheetCellLabels && orderBy(sheetCellLabels, [ 'value' ]).forEach(sheetLabel => {
      visibleCellValue = visibleCellValue.replace(sheetLabel.value + ";", '')
    })
    return visibleCellValue
  }

  return (
    <SheetCellContainer
      testId="SheetCellLabels"
      sheetId={sheetId}
      cell={cell}
      cellType='LABELS'
      beginEditing={beginEditing}
      completeEditing={completeEditing}
      onlyRenderChildren
      value={cell.value}>
      <Container>
        <LabelsContainer
          data-testid="SheetCellLabelsLabelsContainer">
          {sheetCellLabels && orderBy(sheetCellLabels, [ 'value' ]).map(sheetLabel => (
            <SheetCellLabelsLabel
              key={sheetLabel.id}
              sheetId={sheetId}
              cellId={cell.id}
              labelId={sheetLabel.id}/>
          ))}
        </LabelsContainer>
        <ValueContainer
          data-testid="SheetCellLabelsValueContainer">
          {cell.isCellEditing
            ? <StyledInput
                data-testid="SheetCellLabelsInput"
                ref={input}
                onBlur={e => e.preventDefault()}
                onChange={handleEditing}
                value={getVisibleCellValue(cell.value)}/>
            : <Value>
                {getVisibleCellValue(cell.value)}
              </Value>
          }
        </ValueContainer>
      </Container>
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`

const LabelsContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

const ValueContainer = styled.div`
  flex-grow: 1;
`

const StyledInput = styled.input`
  width: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  background-color: transparent;
`

const Value = styled.div`
  width: 100%;
  white-space: nowrap;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellLabels
