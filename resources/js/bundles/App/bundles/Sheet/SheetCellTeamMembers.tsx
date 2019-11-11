//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { ISheetCell, ISheetColumnType } from '@app/state/sheet/types'

import SheetCellAutosizeTextarea from '@app/bundles/Sheet/SheetCellAutosizeTextarea'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellString = ({
  testId,
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellStringProps) => {
  
  const autosizeTextarea = useRef(null)
  
  const [ localIsCellEditing, setLocalIsCellEditing ] = useState(false)

  const allTeamMembers = useSelector((state: IAppState) => state.teams.allTeamMembers)
  const alphabetizedTeamMembers = _.sortBy(allTeamMembers, [ 'name' ])
  const filteredAlphabetizedTeamMembers = ![null, ''].includes(value)
    ? alphabetizedTeamMembers.filter(teamMember => teamMember.name.includes(value))
    : alphabetizedTeamMembers
  
  useEffect(() => {
    if(localIsCellEditing) {
      const autosizeTextareaLength = autosizeTextarea.current.value && autosizeTextarea.current.value.length || 0
      autosizeTextarea.current.focus()
      autosizeTextarea.current.setSelectionRange(autosizeTextareaLength,autosizeTextareaLength)
    }
  }, [ localIsCellEditing ])
  
  const handleCellEditingStart = () => {
    setLocalIsCellEditing(true)
  }
  
  const handleCellEditingEnd = () => {
    setLocalIsCellEditing(false)
  }

  return (
    <SheetCellContainer
      testId={"SheetCellTeamMembers"}
      updateCellValue={updateCellValue}
      focusCell={handleCellEditingStart}
      onCloseCell={handleCellEditingEnd}
      value={value}
      {...passThroughProps}>
      <AutosizeTextareaContainer>
        <SheetCellAutosizeTextarea
          ref={autosizeTextarea}
          onChange={(e: any) => updateCellValue(e.target.value)}
          value={value}/>
      </AutosizeTextareaContainer>
      {localIsCellEditing &&
        <TeamMembersContainer>
          {filteredAlphabetizedTeamMembers.map(teamMember => (
            <TeamMember
              key={teamMember.id}>
              {teamMember.name}
            </TeamMember>
          ))}
        </TeamMembersContainer>
      }
    </SheetCellContainer>
  )

}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetCellStringProps {
  sheetId: string
  cell: ISheetCell
  cellId: string
  columnType: ISheetColumnType
  isCellSelected: boolean
  testId?: string
  updateCellValue(nextCellValue: string): void
  value: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const AutosizeTextareaContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
  overflow: hidden;
`

const TeamMembersContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  background-color: rgb(253, 253, 253);
`

const TeamMember = styled.div`
  padding: 0.25rem 0.5rem;
  &:hover {
    background-color: rgb(245, 245, 245);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellString
