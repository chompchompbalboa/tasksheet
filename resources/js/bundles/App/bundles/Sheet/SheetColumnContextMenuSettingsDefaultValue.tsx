//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { IAppState } from '@app/state'
import { 
  ISheet,
  ISheetColumn
} from '@app/state/sheet/types'
import {
  updateSheetColumn
} from '@app/state/sheet/actions'

import ContextMenuItemInput from '@app/bundles/ContextMenu/ContextMenuItemInput'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SheetColumnContextMenuSettings = ({
  sheetId,
  columnId,
}: ISheetColumnContextMenuSettingsProps) => {

  // Redux
  const dispatch = useDispatch()
  const sheetColumnDefaultValue = useSelector((state: IAppState) => state.sheet.allSheetColumns && state.sheet.allSheetColumns[columnId] && state.sheet.allSheetColumns[columnId].defaultValue)

  // State
  const [ inputValue, setInputValue ] = useState(sheetColumnDefaultValue)

  // Effects
  useEffect(() => {
    let updateSheetColumnTimer: number = null
    if(inputValue !== sheetColumnDefaultValue) {
      clearTimeout(updateSheetColumnTimer)
      updateSheetColumnTimer = setTimeout(() => {
        dispatch(updateSheetColumn(columnId, { defaultValue: inputValue } ))
      }, 500)
    }
    return () => clearTimeout(updateSheetColumnTimer)
  }, [ inputValue ])

  useEffect(() => {

  })

  // Render
  return (
    <ContextMenuItemInput
      sheetId={sheetId}
      inputValue={inputValue}
      placeholder="None..."
      setInputValue={setInputValue}
      text="Default Value:"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetColumnContextMenuSettingsProps {
  sheetId: ISheet['id']
  columnId: ISheetColumn['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetColumnContextMenuSettings
