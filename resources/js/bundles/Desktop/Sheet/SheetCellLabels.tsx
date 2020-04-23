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
  updateSheetCell
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
  const [ inputValue, setInputValue ] = useState('')

  // Effects
  useEffect(() => {
    if(cell.isCellEditing && input && input.current) {
      input.current.focus()
    }
  }, [ cell.isCellEditing ])
  
  // Begin Editing
  const beginEditing = (value: string = null) => {
    dispatch(updateSheet(sheetId, { isCellEditing: true }, true))
    dispatch(updateSheetCell(cell.id, { isCellEditing: true }, null, true ))
    setInputValue(value)
  }
  
  // Complete Editing
  const completeEditing = () => {
    dispatch(updateSheetCell(cell.id, { isCellEditing: false }, null, true))
    dispatch(updateSheet(sheetId, { isCellEditing: false }, true))
    setInputValue('')
    setTimeout(() => {
      if(inputValue && inputValue !== '' && inputValue !== cell.value) {
        dispatch(addSheetColumnAllCellValue(columnId, inputValue))
        dispatch(createSheetCellLabel(sheetId, cell.id, inputValue, cell.value, getFullCellValue(inputValue)))
        if(isTrackCellChanges) {
          dispatch(createSheetCellChange(sheetId, cell.id, 'New Label: ' + inputValue))
        }
      }
    }, 10)
  }
  
  // Handle Editing
  const handleEditing = (e: ChangeEvent<HTMLInputElement>) => {
    const nextSheetCellValue = e.target.value
    setInputValue(nextSheetCellValue)
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

  return (
    <SheetCellContainer
      testId="SheetCellLabels"
      sheetId={sheetId}
      cell={cell}
      cellType='LABELS'
      beginEditing={beginEditing}
      completeEditing={completeEditing}
      onlyRenderChildren
      value={inputValue}>
      <Container>
        <LabelsContainer
          data-testid="SheetCellLabelsLabelsContainer">
          {sheetCellLabels && orderBy(sheetCellLabels, [ 'value' ]).map(sheetLabel => (
            <SheetCellLabelsLabel
              key={sheetLabel.id}
              sheetId={sheetId}
              cellId={cell.id}
              labelId={sheetLabel.id}
              isTrackCellChanges={isTrackCellChanges}/>
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
                value={inputValue || ''}/>
            : <Value>
                {inputValue}
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
