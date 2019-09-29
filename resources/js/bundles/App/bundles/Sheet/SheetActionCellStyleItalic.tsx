//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ITALIC } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {
  updateSheetStyles as updateSheetStylesAction
} from '@app/state/sheet/actions'

import SheetActionCellStyleButton from '@app/bundles/Sheet/SheetActionCellStyleButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionCellStyleItalic = ({
  sheetId
}: SheetActionCellStyleItalicProps) => {
  
  const dispatch = useDispatch()
  
  const sheetStyles = useSelector((state: IAppState) => state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].styles)
  
  const updateSheetStylesSet = (nextSheetStylesSet: Set<string>) => {
    dispatch(updateSheetStylesAction(sheetId, {
      italic: nextSheetStylesSet 
    }))
  }

  return (
    <SheetActionCellStyleButton
      sheetId={sheetId}
      icon={ITALIC}
      sheetStylesSet={sheetStyles && sheetStyles.italic}
      updateSheetStylesSet={updateSheetStylesSet}/>
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
