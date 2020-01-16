//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'

import { ISheet } from '@/state/sheet/types'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionSearch = ({
  sheetId
}: ISheetActionSearch) => {
  
  // State
  const [ autosizeInputValue, setAutosizeInputValue ] = useState('')

  // Handle Button Click
  const handleAutosizeInputChange = (searchValue: string) => {
    console.log(sheetId)
    setAutosizeInputValue(searchValue)
  }

  return (
    <AutosizeInput
      placeholder="Search..."
      value={autosizeInputValue}
      onChange={e => handleAutosizeInputChange(e.target.value)}
      inputStyle={{
        marginRight: '0.25rem',
        padding: '0.125rem 0',
        height: '100%',
        minWidth: '4.25rem',
        border: 'none',
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
