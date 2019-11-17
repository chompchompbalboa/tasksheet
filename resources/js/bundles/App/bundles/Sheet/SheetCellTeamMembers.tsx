//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'
import { ISheetCell, ISheetColumnType } from '@app/state/sheet/types'
import { ITeamMember } from '@app/state/team/types'

import {
  allowSelectedCellNavigation,
  preventSelectedCellNavigation,
  updateSheetCell
} from '@app/state/sheet/actions'

import SheetCellInput from '@app/bundles/Sheet/SheetCellInput'
import SheetCellContainer from '@app/bundles/Sheet/SheetCellContainer'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetCellString = ({
  testId,
  sheetId,
  cellId,
  updateCellValue,
  value,
  ...passThroughProps
}: SheetCellStringProps) => {
  
  const autosizeInput = useRef(null)
  
  const [ localIsCellEditing, setLocalIsCellEditing ] = useState(false)
  const [ highlightedTeamMemberIndex, setHighlightedTeamMemberIndex ] = useState(null)
  const [ isValueStale, setIsValueStale ] = useState(true)

  const dispatch = useDispatch()
  const allTeamMembers = useSelector((state: IAppState) => state.teams.allTeamMembers)
  const alphabetizedTeamMembers = _.sortBy(allTeamMembers, [ 'name' ])
  const filteredAlphabetizedTeamMembers = ![null, ''].includes(value) && !isValueStale
    ? alphabetizedTeamMembers.filter(teamMember => teamMember.name.includes(value))
    : alphabetizedTeamMembers
  
  useEffect(() => {
    if(localIsCellEditing) {
      if(autosizeInput && autosizeInput.current) {
        autosizeInput && autosizeInput.current && autosizeInput.current.focus()
     }
      addEventListener('keydown', handleKeydownWhileCellIsEditing)
    }
    return () => {
      removeEventListener('keydown', handleKeydownWhileCellIsEditing)
    }
  }, [ localIsCellEditing, highlightedTeamMemberIndex, value ])

  const handleCellEditingStart = () => {
    dispatch(preventSelectedCellNavigation(sheetId))
    setLocalIsCellEditing(true)
  }
  
  const handleCellEditingEnd = () => {
    dispatch(allowSelectedCellNavigation(sheetId))
    setLocalIsCellEditing(false)
    setIsValueStale(true)
    setHighlightedTeamMemberIndex(null)
  }

  const handleKeydownWhileCellIsEditing = (e: KeyboardEvent) => {
    if(e.key === "Enter" && filteredAlphabetizedTeamMembers.length > 0) {
      const nextTeamMember = highlightedTeamMemberIndex && filteredAlphabetizedTeamMembers[highlightedTeamMemberIndex]
        ? filteredAlphabetizedTeamMembers[highlightedTeamMemberIndex]
        : filteredAlphabetizedTeamMembers[0]
      dispatch(updateSheetCell(cellId, { isCellEditing: false, value: nextTeamMember.name }))
      handleCellEditingEnd()
    }
    if(e.key === "ArrowUp") {
      setHighlightedTeamMemberIndex(Math.max(0, highlightedTeamMemberIndex - 1))
    }
    if(e.key === "ArrowDown") {
      setHighlightedTeamMemberIndex(Math.min(filteredAlphabetizedTeamMembers.length - 1, highlightedTeamMemberIndex + 1))
    }
  }
  
  const handleTeamMemberClick = (teamMember: ITeamMember) => {
    dispatch(updateSheetCell(cellId, { isCellEditing: false, value: teamMember.name }))
    handleCellEditingEnd()
  }
  
  const handleValueChange = (nextValue: string) => {
    setIsValueStale(false)
    updateCellValue(nextValue)
  }

  return (
    <SheetCellContainer
      testId={"SheetCellTeamMembers"}
      sheetId={sheetId}
      cellId={cellId}
      updateCellValue={updateCellValue}
      focusCell={handleCellEditingStart}
      onCloseCell={handleCellEditingEnd}
      value={value}
      {...passThroughProps}>
      <InputContainer>
        <SheetCellInput
          ref={autosizeInput}
          onChange={(e: any) => handleValueChange(e.target.value)}
          value={value}/>
      </InputContainer>
      {localIsCellEditing &&
        <TeamMembersContainer>
          {filteredAlphabetizedTeamMembers.map((teamMember, index) => (
            <TeamMember
              key={teamMember.id}
              isHighlighted={index === highlightedTeamMemberIndex}
              onClick={() => handleTeamMemberClick(teamMember)}
              onMouseEnter={() => setHighlightedTeamMemberIndex(index)}>
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
const InputContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.15rem 0.25rem;
`

const TeamMembersContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  background-color: rgb(253, 253, 253);
  overflow: hidden;
`

const TeamMember = styled.div`
  padding: 0.15rem 0.25rem;
  background-color: ${ ({ isHighlighted }: ITeamMemberProps ) => isHighlighted ? 'rgb(245, 245, 245)' : 'transparent' };
  color: black;
`
interface ITeamMemberProps {
  isHighlighted: boolean
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetCellString
