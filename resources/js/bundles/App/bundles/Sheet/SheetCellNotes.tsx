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
  ISheetColumnType,
  ISheetNote
} from '@app/state/sheet/types'
import {
  createSheetCellNote,
  deleteSheetCellNote
} from '@app/state/sheet/actions'

import Icon from '@/components/Icon'
import SheetCellAutosizeTextarea from '@app/bundles/Sheet/SheetCellAutosizeTextarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellNotes = ({
  sheetId,
  cellId,
  isCellSelected,
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellNotesProps) => {
  
  const autosizeTextarea = useRef(null)

  const dispatch = useDispatch()
  const sheetCellNotes = useSelector((state: IAppState) => state.sheet.allSheetCellNotes[cellId] && state.sheet.allSheetCellNotes[cellId].map((sheetNoteId: ISheetNote['id']) => {
    return state.sheet.allSheetNotes[sheetNoteId]
  }))
  
  const [ localIsCellEditing, setLocalIsCellEditing ] = useState(false)
  
  useEffect(() => {
    if(localIsCellEditing) {
      const autosizeTextareaLength = autosizeTextarea.current.value && autosizeTextarea.current.value.length || 0
      autosizeTextarea.current.focus()
      autosizeTextarea.current.setSelectionRange(autosizeTextareaLength,autosizeTextareaLength)
    }
  }, [ localIsCellEditing ])
  
  const handleCellEditingStart = () => {
    setLocalIsCellEditing(true)
    if(![null, ''].includes(value)) {
      dispatch(createSheetCellNote(sheetId, cellId, value))
    }
  }
  
  const handleCellEditingEnd = () => {
    setLocalIsCellEditing(false)
  }

  const handleCurrentNoteValueChange = (nextCellValue: string) => {
    updateCellValue(nextCellValue)
  }

  return (
    <SheetCellContainer
      testId="SheetCellNotes"
      sheetId={sheetId}
      cellId={cellId}
      focusCell={() => handleCellEditingStart()}
      isCellSelected={isCellSelected}
      onCloseCell={() => handleCellEditingEnd()}
      onlyRenderChildren
      updateCellValue={updateCellValue}
      value={value}
      {...passThroughProps}>
      <CurrentNoteContainer>
        {localIsCellEditing
          ? <SheetCellAutosizeTextarea
              ref={autosizeTextarea}
              onChange={(e: any) => handleCurrentNoteValueChange(e.target.value)}
              value={value}/>
          : <CurrentNote>
              {value}
            </CurrentNote>
        }
      </CurrentNoteContainer>
      {sheetCellNotes && sheetCellNotes.length > 0 &&
        <NotesContainer>
          {sheetCellNotes.map(sheetCellNote => (
            <Note
              key={sheetCellNote.id}>
              <NoteValue>
                {sheetCellNote.value}
              </NoteValue>
              <NoteDetailsAndActions>
                <NoteDetails>
                  {sheetCellNote.createdBy}<br/>
                  {moment(sheetCellNote.createdAt).format('LLL')}
                </NoteDetails>
                <NoteActions>
                  <DeleteNote
                    onClick={() => dispatch(deleteSheetCellNote(cellId, sheetCellNote.id))}>
                    <Icon
                      icon={TRASH_CAN}
                      size="0.85rem"/>
                  </DeleteNote>
                </NoteActions>
              </NoteDetailsAndActions>
            </Note>
          ))}
        </NotesContainer>
      }
    </SheetCellContainer>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetCellNotesProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  columnType: ISheetColumnType
  isCellSelected: boolean
  updateCellValue(nextCellValue: string): void
  value: string
}

const CurrentNoteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
`

const CurrentNote = styled.div`
`

const NotesContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  background-color: rgb(245, 245, 245);
`

const Note = styled.div`
  margin: 0.25rem 0;
  padding: 0.5rem;
  min-width: 15rem;
  background-color: white;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: rgb(253, 253, 253);
  }
`

const NoteValue = styled.div`
  max-width: 25rem;
`

const NoteDetailsAndActions = styled.div`
  margin-left: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NoteDetails = styled.div`
  font-size: 0.7rem;
  font-style: italic;
  text-align: right;
`

const NoteActions = styled.div`
  margin-left: 0.375rem;
  padding: 0 0.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DeleteNote = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellNotes
