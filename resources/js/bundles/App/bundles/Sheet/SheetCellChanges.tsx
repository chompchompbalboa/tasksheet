//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { TRASH_CAN } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { 
  ISheetChange
} from '@app/state/sheet/types'
import {
  deleteSheetCellChange
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellChanges = ({
  cellId
}: ISheetCellChangesProps) => {

  const dispatch = useDispatch()
  const sheetCellChanges = useSelector((state: IAppState) => state.sheet.allSheetCellChanges[cellId] && state.sheet.allSheetCellChanges[cellId].map((sheetChangeId: ISheetChange['id']) => {
    return state.sheet.allSheetChanges[sheetChangeId]
  }))

  return (
    <Container>
      {sheetCellChanges &&
        <ChangesContainer>
          {sheetCellChanges.map(sheetCellChange => (
            <Change
              key={sheetCellChange.id}>
              <ChangeValue>
                {sheetCellChange.value}
              </ChangeValue>
              <ChangeDetailsAndActions>
                <ChangeDetails>
                  {sheetCellChange.createdBy}<br/>
                  {moment(sheetCellChange.createdAt).format('MMMM Do, YYYY')}<br/>
                  {moment(sheetCellChange.createdAt).format('hh:mm a')}
                </ChangeDetails>
                <ChangeActions>
                  <DeleteChange
                    onClick={() => dispatch(deleteSheetCellChange(cellId, sheetCellChange.id))}>
                    <Icon
                      icon={TRASH_CAN}
                      size="0.85rem"/>
                  </DeleteChange>
                </ChangeActions>
              </ChangeDetailsAndActions>
            </Change>
          ))}
        </ChangesContainer>
      }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellChangesProps {
  cellId: string
}

const Container = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
`

const ChangesContainer = styled.div`
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  background-color: rgb(245, 245, 245);
`

const Change = styled.div`
  width: 100%;
  margin: 0.25rem 0;
  padding: 0.5rem;
  background-color: white;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: rgb(253, 253, 253);
  }
`

const ChangeValue = styled.div`
  white-space: normal;
`

const ChangeDetailsAndActions = styled.div`
  width: 33%;
  margin-left: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const ChangeDetails = styled.div`
  font-size: 0.7rem;
  font-style: italic;
  text-align: right;
  white-space: nowrap;
`

const ChangeActions = styled.div`
  margin-left: 0.375rem;
  padding: 0 0.375rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const DeleteChange = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellChanges
