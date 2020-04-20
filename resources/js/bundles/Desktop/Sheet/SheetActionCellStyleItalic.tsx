//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ITALIC } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@/state/sheet/actions'

import SheetActionCellStyleButton from '@desktop/Sheet/SheetActionCellStyleButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleItalic = ({
  sheetId
}: SheetActionCellStyleItalicProps) => {
  
  // Redux
  const dispatch = useDispatch()
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  // Update Sheet Styles
  const updateSheetStyles = (nextSheetStylesSet: Set<string>) => {
    dispatch(updateSheetStylesAction(sheetId, {
      italic: nextSheetStylesSet 
    }))
  }

  return (
    <SheetActionCellStyleButton
      sheetId={sheetId}
      icon={ITALIC}
      sheetStylesSet={sheetStyles && sheetStyles.italic}
      updateSheetStyles={updateSheetStyles}
      tooltip="Italic"/>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetActionCellStyleItalicProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionCellStyleItalic
