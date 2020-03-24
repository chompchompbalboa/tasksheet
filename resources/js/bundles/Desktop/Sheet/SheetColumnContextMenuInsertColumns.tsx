//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { 
  ISheet
} from '@/state/sheet/types'
import { 
  createSheetColumns
} from '@/state/sheet/actions'

import ContextMenuItemWithInput from '@desktop/ContextMenu/ContextMenuItemWithInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuInsertColumn = ({
  sheetId,
  columnIndex,
  closeContextMenu,
}: ISheetColumnContextMenuInsertColumnsProps) => {
  
  // Redux
  const dispatch = useDispatch()

  // State
  const [ inputValue, setInputValue ] = useState(0)

  // Create Columns
  const createColumns = () => {
    dispatch(createSheetColumns(sheetId, columnIndex, inputValue))
    closeContextMenu()
  }

  // Handle Input Change
  const handleInputChange = (nextInputValue: string) => {
    if(isNaN(Number(nextInputValue))) {
      setInputValue(0)
    }
    else {
      setInputValue(Math.min(10, Math.max(0, Number(nextInputValue))))
    }
  }

  // Handle Input Key Press
  const handleInputKeyPress = (key: string) => {
    if(key === "Enter") {
      createColumns()
    }
  }

  return (
    <ContextMenuItemWithInput
      testId="SheetColumnContextMenuInsertColumn"
      sheetId={sheetId}
      inputPlaceholder={"1"}
      inputValue={inputValue === 0 ? '' : inputValue + ''}
      isFirstItem 
      onInputChange={handleInputChange}
      onInputKeyPress={handleInputKeyPress}
      textBeforeInput="Insert" 
      textAfterInput={inputValue > 1 ? "Columns" : "Column"} 
      onClick={createColumns}/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuInsertColumnsProps {
  sheetId: ISheet['id']
  columnIndex: number
  closeContextMenu(): void
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuInsertColumn
