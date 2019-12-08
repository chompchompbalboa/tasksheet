//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { TRASH_CAN } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { 
  ISheetCell, 
  ISheetChange
} from '@app/state/sheet/types'
import {
  createSheetCellChange,
  deleteSheetCellChange
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'
import SheetCellInput from '@app/bundles/Sheet/SheetCellInput'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellChanges = ({
  sheetId,
  cellId,
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellChangesProps) => {
  
  const autosizeTextarea = useRef(null)

  const dispatch = useDispatch()
  const sheetCellChanges = useSelector((state: IAppState) => state.sheet.allSheetCellChanges[cellId] && state.sheet.allSheetCellChanges[cellId].map((sheetChangeId: ISheetChange['id']) => {
    return state.sheet.allSheetChanges[sheetChangeId]
  }))
  
  const [ localIsCellEditing, setLocalIsCellEditing ] = useState(false)
  const [ localValue, setLocalValue ] = useState(null)
  
  useEffect(() => {
    if(localIsCellEditing) {
      const autosizeTextareaLength = autosizeTextarea.current.value && autosizeTextarea.current.value.length || 0
      autosizeTextarea.current.focus()
      autosizeTextarea.current.setSelectionRange(autosizeTextareaLength,autosizeTextareaLength)
    }
  }, [ localIsCellEditing ])
  
  useEffect(() => {
    if(!localIsCellEditing && localValue !== null) {
      if(![null, ''].includes(value)) {
        dispatch(createSheetCellChange(sheetId, cellId, value))
        setLocalValue(null)
      }
    }
  }, [ localIsCellEditing, value, localValue ])
  
  const handleCellEditingStart = () => {
    setLocalIsCellEditing(true)
  }
  
  const handleCellEditingEnd = () => {
    setLocalIsCellEditing(false)
  }

  const handleCurrentChangeValueChange = (nextCellValue: string) => {
    setLocalValue(nextCellValue)
    updateCellValue(nextCellValue)
  }

  return (
    <SheetCellContainer
      testId="SheetCellChanges"
      sheetId={sheetId}
      cellId={cellId}
      focusCell={handleCellEditingStart}
      onCloseCell={handleCellEditingEnd}
      onlyRenderChildren
      updateCellValue={updateCellValue}
      value={value}
      {...passThroughProps}>
      <CurrentChangeContainer>
        {localIsCellEditing
          ? <SheetCellInput
              ref={autosizeTextarea}
              onChange={(e: any) => handleCurrentChangeValueChange(e.target.value)}
              value={value}/>
          : <CurrentChange>
              {value}
            </CurrentChange>
        }
      </CurrentChangeContainer>
      {sheetCellChanges && sheetCellChanges.length > 0 &&
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
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellChangesProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

const CurrentChangeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
  overflow: hidden;
`

const CurrentChange = styled.div`
`

const ChangesContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
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
