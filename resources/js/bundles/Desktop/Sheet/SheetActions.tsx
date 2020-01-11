//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { LOCK_OPEN, LOCK_CLOSED } from '@/assets/icons'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import {
  updateSheetView
} from '@/state/sheet/actions'

import SheetActionButton from '@desktop/Sheet/SheetActionButton'
import SheetActionCellStyleBackgroundColor from '@desktop/Sheet/SheetActionCellStyleBackgroundColor'
import SheetActionCellStyleBold from '@desktop/Sheet/SheetActionCellStyleBold'
import SheetActionCellStyleColor from '@desktop/Sheet/SheetActionCellStyleColor'
import SheetActionCellStyleItalic from '@desktop/Sheet/SheetActionCellStyleItalic'
import SheetActionCreateSheet from '@desktop/Sheet/SheetActionCreateSheet'
import SheetActionCreateRows from '@desktop/Sheet/SheetActionCreateRows'
import SheetActionSheetViews from '@desktop/Sheet/SheetActionSheetViews'
import SheetActionCreateSheetLink from '@desktop/Sheet/SheetActionCreateSheetLink'
import SheetActionDownloadCsv from '@desktop/Sheet/SheetActionDownloadCsv'
import SheetActionFilter from '@desktop/Sheet/SheetActionFilter'
import SheetActionGroup from '@desktop/Sheet/SheetActionGroup'
import SheetActionRefreshVisibleRows from '@desktop/Sheet/SheetActionRefreshVisibleRows'
import SheetActionPriorities from '@desktop/Sheet/SheetActionPriorities'
import SheetActionSort from '@desktop/Sheet/SheetActionSort'
import SheetActionUploadCsv from '@desktop/Sheet/SheetActionUploadCsv'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  sheetId,
}: ISheetActionsProps) => {

  // Redux
  const dispatch = useDispatch()
  const activeSheetView = useSelector((state: IAppState) => {
    const activeSheetViewId = state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId
    if(activeSheetViewId && state.sheet.allSheetViews && state.sheet.allSheetViews[activeSheetViewId]) {
      return state.sheet.allSheetViews[activeSheetViewId]
  }})
  const isDemoUser = useSelector((state: IAppState) => state.user.tasksheetSubscription.type === 'DEMO')

  // State
  const [ isSheetViewLocked, setIsSheetViewLocked ] = useState((activeSheetView && activeSheetView.isLocked) || true)

  // Effects
  useEffect(() => {
    if(activeSheetView) {
      setIsSheetViewLocked(activeSheetView.isLocked)
    }
  }, [ activeSheetView && activeSheetView.isLocked ])

  // Toggle Is Sheet View Locked
  const toggleIsSheetViewLocked = () => {
    const nextIsSheetViewLocked = !isSheetViewLocked
    setIsSheetViewLocked(nextIsSheetViewLocked)
    dispatch(updateSheetView(activeSheetView.id, {
      isLocked: nextIsSheetViewLocked
    }))
  }

  return (
    <Container>
      <SheetActionSheetViews sheetId={sheetId}/>
      <SheetActionRefreshVisibleRows sheetId={sheetId}/>
      <SheetActionButton
        icon={!isSheetViewLocked ? LOCK_CLOSED : LOCK_OPEN}
        marginLeft="0.375rem"
        marginRight={!isSheetViewLocked ? "0.4125rem" : "0"}
        onClick={() => toggleIsSheetViewLocked()}
        tooltip={!isSheetViewLocked ? 'Lock the view' : 'Unlock the view'}/>
      {!isSheetViewLocked &&
        <>
          <SheetActionFilter sheetId={sheetId}/>
          <SheetActionGroup sheetId={sheetId}/>
          <SheetActionSort sheetId={sheetId}/>
        </>
      }
      <Divider />
      <SheetActionPriorities sheetId={sheetId}/>
      <Divider />
      <SheetActionCreateRows sheetId={sheetId}/>
      <Divider />
      <SheetActionCellStyleBold sheetId={sheetId}/>
      <SheetActionCellStyleItalic sheetId={sheetId}/>
      <SheetActionCellStyleBackgroundColor sheetId={sheetId}/>
      <SheetActionCellStyleColor sheetId={sheetId}/>
      <Divider />
      {!isDemoUser && 
        <>
          <SheetActionCreateSheet/>
          <SheetActionUploadCsv/>
          <Divider />
          <SheetActionCreateSheetLink sheetId={sheetId}/>
        </>
      }
      <Divider />
      <SheetActionDownloadCsv sheetId={sheetId}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionsProps {
  sheetId: ISheet['id']
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  z-index: 10;
  width: 100%;
  position: sticky;
  top: 0;
  padding: 0.25rem 0.125rem;
  padding-left: 0.5rem;
  display: flex;
  flex-flow: row-wrap;
  align-items: center;
  min-height: 2.75rem;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(175, 175, 175);
`

const Divider = styled.div`
  margin: 0 0.75rem;
  height: 1.5rem;
  width: 1px;
  min-width: 1px;
  background-color: rgb(175, 175, 175)
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
