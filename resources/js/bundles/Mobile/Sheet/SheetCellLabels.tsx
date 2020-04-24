//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { ChangeEvent, useState } from 'react'
import { orderBy } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { getFullCellValue } from '@desktop/Sheet/SheetCellLabels'
import { ISheetCellTypesSharedProps } from '@mobile/Sheet/SheetCell'

import { IAppState } from '@/state'

import { 
  addSheetColumnAllCellValue,
  createSheetCellChange,
  createSheetCellLabel
} from '@/state/sheet/actions'

import SheetCellContainer from '@mobile/Sheet/SheetCellContainer'
import SheetCellLabelsLabel from '@mobile/Sheet/SheetCellLabelsLabel'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellLabels = ({
  sheetId,
  columnId,
  cell,
  isTrackCellChanges
}: ISheetCellTypesSharedProps) => {

  // Redux
  const dispatch = useDispatch()
  const sheetCellLabels = useSelector((state: IAppState) => state.sheet.allSheetLabels && state.sheet.allSheetCellLabels && state.sheet.allSheetCellLabels[cell.id] && state.sheet.allSheetCellLabels[cell.id].map(labelId => {
    return state.sheet.allSheetLabels[labelId]
  }))

  // State
  const [ inputValue, setInputValue ] = useState('')
  const [ isInputFocused, setIsInputFocused ] = useState(false)

  // Handle Input Blur
  const handleInputBlur = () => {
    setIsInputFocused(false)
    if(inputValue && inputValue !== '') {
      dispatch(addSheetColumnAllCellValue(columnId, inputValue))
      dispatch(createSheetCellLabel(sheetId, cell.id, inputValue, cell.value, getFullCellValue(sheetCellLabels, inputValue)))
      if(isTrackCellChanges) {
        dispatch(createSheetCellChange(sheetId, cell.id, 'New Label: ' + inputValue))
      }
      setInputValue('')
    }
  }

  return (
    <SheetCellContainer>
      <Container>
        <LabelsContainer>
          {sheetCellLabels && orderBy(sheetCellLabels, [ 'value' ]).map(sheetLabel => (
            <SheetCellLabelsLabel
              key={sheetLabel.id}
              sheetId={sheetId}
              cellId={cell.id}
              labelId={sheetLabel.id}
              isTrackCellChanges={isTrackCellChanges}/>
          ))}
        </LabelsContainer>
        <InputContainer>
          <StyledInput
            isInputFocused={isInputFocused}
            onBlur={handleInputBlur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            value={inputValue || ''}/>
        </InputContainer>
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
  overflow-x: scroll;
  display: flex;
  align-items: center;
`

const LabelsContainer = styled.div`
  display: flex;
`

const InputContainer = styled.div`
  flex-grow: 1;
  min-width: 5rem;
  background-color: white;
`

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  letter-spacing: inherit;
  border: none;
  outline: none;
  background-color: ${ ({ isInputFocused }: IStyledInput ) => isInputFocused ? 'white' : 'transparent' };
  text-align: right;
`
interface IStyledInput {
  isInputFocused: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellLabels
