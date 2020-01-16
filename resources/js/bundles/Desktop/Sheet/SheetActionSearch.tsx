//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import {
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation,
  refreshSheetVisibleRows,
  updateSheetView
} from '@/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSearch = ({
  sheetId
}: ISheetActionSearch) => {

  // Refs
  const updateSheetViewSearchValueTimeout = useRef(0)

  // Redux
  const dispatch = useDispatch()
  const activeSheetViewId = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId)
  
  // State
  const [ hasLoaded, setHasLoaded ] = useState(false)
  const [ isInputFocused, setIsInputFocused ] = useState(false)
  const [ searchValue, setSearchValue ] = useState(null)

  // Effects
  useEffect(() => {
    clearTimeout(updateSheetViewSearchValueTimeout.current)
    if(hasLoaded && searchValue === '') { // Immediately refresh the view if the user has deleted the search value
      updateSheetViewSearchValue(searchValue)
    }
    else if(hasLoaded) { // Otherwise, set the timeout 
      updateSheetViewSearchValueTimeout.current = setTimeout(() => updateSheetViewSearchValue(searchValue), 500)
    }
  }, [ searchValue ])
  
  useEffect(() => {
    if(isInputFocused) {
      addEventListener('keydown', handleKeydownWhileInputIsFocused)
    }
    else {
      removeEventListener('keydown', handleKeydownWhileInputIsFocused)
    }
    return () => removeEventListener('keydown', handleKeydownWhileInputIsFocused)
  }, [ isInputFocused, searchValue ])

  useEffect(() => {
    setHasLoaded(true)
  }, [])

  // Handle  Input Blur
  const handleInputBlur = () => {
    setIsInputFocused(false)
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
  }

  // Handle  Input Change
  const handleInputChange = (nextSearchValue: string) => {
    setSearchValue(nextSearchValue)
  }

  // Handle  Input Focus
  const handleInputFocus = () => {
    setIsInputFocused(true)
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
  }
  
  // Handle Keydown While Input Is Focused
  const handleKeydownWhileInputIsFocused = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      clearTimeout(updateSheetViewSearchValueTimeout.current)
      updateSheetViewSearchValue(searchValue)
    }
  }

  // Update Sheet View Search Value
  const updateSheetViewSearchValue = (nextSearchValue: string) => {
    dispatch(updateSheetView(activeSheetViewId, {
      searchValue: nextSearchValue
    }, true))
    setTimeout(() => {
      dispatch(refreshSheetVisibleRows(sheetId))
    }, 25)
  }

  return (
    <AutosizeInput
      placeholder="Search..."
      value={searchValue || ''}
      onBlur={handleInputBlur}
      onChange={e => handleInputChange(e.target.value)}
      onFocus={handleInputFocus}
      inputStyle={{
        padding: '0.375rem',
        height: '100%',
        minWidth: '5rem',
        border: '0.5px solid rgb(180, 180, 180)',
        borderRadius: '5px',
        backgroundColor: 'transparent',
        outline: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit'}}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionSearch {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionSearch
