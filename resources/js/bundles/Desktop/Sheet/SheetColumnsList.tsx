//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { 
  ISheet,
  ISheetColumn,
  ISheetCellType
} from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetColumnsList = ({
  sheetId,
  alternateText = 'Choose Date',
  cellTypes,
  currentColumnId,
  excludedColumnIds = [],
  onColumnClick
}: ISheetColumnsList) => {

  // Refs
  const container = useRef(null)

  // Redux
  const currentColumn = useSelector((state: IAppState) => currentColumnId && state.sheet.allSheetColumns[currentColumnId])
  const sheetColumns = useSelector((state: IAppState) => {
    return state.sheet.allSheets[sheetId].columns.map(sheetColumnId => {
      const sheetColumn = state.sheet.allSheetColumns[sheetColumnId]
      if(![ ...excludedColumnIds ].includes(sheetColumn.id)) {
        if(cellTypes) {
          if(cellTypes.includes(sheetColumn.cellType)) {
            return sheetColumn
          }
          return null
        }
        return sheetColumn
      }
    }).filter(Boolean)
  })

  // State
  const [ isDropdownVisible, setIsDropdownVisible ] = useState(false)

  // Add event handlers when dropdown is visible
  useEffect(() => {
    if(isDropdownVisible) {
      addEventListener('click', closeDropdownOnClickOutside)
    }
    else {
      removeEventListener('click', closeDropdownOnClickOutside)
    }
    return () => removeEventListener('click', closeDropdownOnClickOutside)
  }, [ isDropdownVisible ])

  // Close Dropdown On Click Outside
  const closeDropdownOnClickOutside = (e: Event) => {
    if(!container.current.contains(e.target)) {
      setIsDropdownVisible(false)
    }
  }

  return (
    <Container
      ref={container}>
      <CurrentColumnName
        onClick={() => setIsDropdownVisible(true)}>
        {(currentColumn && currentColumn.name) || <em>{alternateText}</em>}
      </CurrentColumnName>
      <ColumnNamesDropdown
        isVisible={isDropdownVisible}>
        {sheetColumns.map(sheetColumn => (
          <ColumnName
            key={sheetColumn.id}
            onClick={() => {
              setIsDropdownVisible(false)
              onColumnClick(sheetColumn.id)
            }}>
            {sheetColumn.name}
          </ColumnName>
        ))}
      </ColumnNamesDropdown>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetColumnsList {
  sheetId: ISheet['id']
  alternateText?: string
  cellTypes?: ISheetCellType[]
  currentColumnId: ISheetColumn['id']
  excludedColumnIds?: ISheetColumn['id'][]
  onColumnClick(columnId: ISheetColumn['id']): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
`

const CurrentColumnName = styled.div`
  cursor: pointer;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`

const ColumnNamesDropdown = styled.div`
  visibility: ${ ({ isVisible }: IColumnNamesDropdown ) => isVisible ? 'auto' : 'hidden' };
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
  border-radius: 4px;
  background-color: rgb(250, 250, 250);
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
`
interface IColumnNamesDropdown {
  isVisible: boolean
}

const ColumnName = styled.div`
  padding: 0.25rem;
  &:hover {
    background-color: rgb(240, 240, 240);
  }
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnsList
