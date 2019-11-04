//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { ISheetCell, ISheetColumnType } from '@app/state/sheet/types'

import SheetCellAutosizeTextarea from '@app/bundles/Sheet/SheetCellAutosizeTextarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetCellNotes = ({
  isCellSelected,
  updateCellValue,
  value,
  ...passThroughProps
}: ISheetCellNotesProps) => {

  const [ localIsCellEditing, setLocalIsCellEditing ] = useState(false)

  const handleCurrentNoteValueChange = (nextCellValue: string) => {
    updateCellValue(nextCellValue)
  }

  return (
    <SheetCellContainer
      testId="SheetCellNotes"
      focusCell={() => setLocalIsCellEditing(true)}
      isCellSelected={isCellSelected}
      onCloseCell={() => setLocalIsCellEditing(false)}
      onlyRenderChildren
      updateCellValue={updateCellValue}
      value={value}
      {...passThroughProps}>
      {}
      <CurrentNoteContainer>
        {localIsCellEditing
          ? <SheetCellAutosizeTextarea
              onChange={(e: any) => handleCurrentNoteValueChange(e.target.value)}
              value={value}/>
          : <CurrentNote>
              {value}
            </CurrentNote>
        }
      </CurrentNoteContainer>
      <NotesContainer>
        Notes
      </NotesContainer>
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
  border-radius: 5px;
  background-color: rgb(245, 245, 245);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellNotes
