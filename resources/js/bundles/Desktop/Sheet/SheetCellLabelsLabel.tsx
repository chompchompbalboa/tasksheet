//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { CLOSE } from '@/assets/icons'
 
import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetCell,
  ISheetLabel 
} from '@/state/sheet/types'

import { deleteSheetCellLabel } from '@/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellLabels = ({
  sheetId,
  cellId,
  labelId
}: ISheetCellLabelsLabel) => {

  // Redux
  const dispatch = useDispatch()
  const label = useSelector((state: IAppState) => state.sheet.allSheetLabels && state.sheet.allSheetLabels[labelId])
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  return (
    <Label
      labelBackgroundColor={userColorPrimary}>
      <LabelValue>
        {label.value}
      </LabelValue>
      <DeleteButton
        data-testid="SheetCellLabelsLabelDeleteButton"
        onClick={() => dispatch(deleteSheetCellLabel(sheetId, cellId, labelId))}>
        <Icon
          icon={CLOSE}
          size="0.75rem"/>
      </DeleteButton>
    </Label>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetCellLabelsLabel {
  sheetId: ISheet['id']
  cellId: ISheetCell['id']
  labelId: ISheetLabel['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Label = styled.div`
  height: 17px;
  padding: 0 0.25rem;
  margin-right: 0.25rem;
  background-color: ${ ({ labelBackgroundColor }: ILabel ) => labelBackgroundColor };
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`
interface ILabel {
  labelBackgroundColor: string
}

const LabelValue = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
`

const DeleteButton = styled.div`
  cursor: pointer;
  margin-left: 0.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellLabels
