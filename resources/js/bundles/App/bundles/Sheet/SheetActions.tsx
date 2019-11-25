//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { LOCK_OPEN, LOCK_CLOSED } from '@app/assets/icons'

import { IAppState } from '@app/state'
import { ISheet } from '@app/state/sheet/types'
import {
  updateSheetView
} from '@app/state/sheet/actions'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionCellStyleBackgroundColor from '@app/bundles/Sheet/SheetActionCellStyleBackgroundColor'
import SheetActionCellStyleBold from '@app/bundles/Sheet/SheetActionCellStyleBold'
import SheetActionCellStyleColor from '@app/bundles/Sheet/SheetActionCellStyleColor'
import SheetActionCellStyleItalic from '@app/bundles/Sheet/SheetActionCellStyleItalic'
import SheetActionCreateSheet from '@app/bundles/Sheet/SheetActionCreateSheet'
import SheetActionCreateRows from '@app/bundles/Sheet/SheetActionCreateRows'
import SheetActionCreateSheetView from '@/bundles/App/bundles/Sheet/SheetActionCreateSheetView'
import SheetActionDownloadCsv from '@app/bundles/Sheet/SheetActionDownloadCsv'
import SheetActionFilter from '@app/bundles/Sheet/SheetActionFilter'
import SheetActionGroup from '@app/bundles/Sheet/SheetActionGroup'
import SheetActionRefreshVisibleRows from '@app/bundles/Sheet/SheetActionRefreshVisibleRows'
import SheetActionPriorities from '@app/bundles/Sheet/SheetActionPriorities'
import SheetActionSort from '@app/bundles/Sheet/SheetActionSort'
import SheetActionUploadCsv from '@app/bundles/Sheet/SheetActionUploadCsv'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  sheetId,
}: ISheetActionsProps) => {

  const dispatch = useDispatch()
  const activeSheetView = useSelector((state: IAppState) => {
    const activeSheetViewId = state.sheet.allSheets && state.sheet.allSheets[sheetId] && state.sheet.allSheets[sheetId].activeSheetViewId
    if(activeSheetViewId && state.sheet.allSheetViews && state.sheet.allSheetViews[activeSheetViewId]) {
      return state.sheet.allSheetViews[activeSheetViewId]
  }})

  const [ isSheetViewLocked, setIsSheetViewLocked ] = useState((activeSheetView && activeSheetView.isLocked) || true)

  useEffect(() => {
    if(activeSheetView) {
      setIsSheetViewLocked(activeSheetView.isLocked)
    }
  })

  const handleIsFiltersGroupsSortsToggle = () => {
    const nextIsSheetViewLocked = !isSheetViewLocked
    setIsSheetViewLocked(nextIsSheetViewLocked)
    dispatch(updateSheetView(activeSheetView.id, {
      isLocked: nextIsSheetViewLocked
    }))
  }

  return (
    <Container>
      <SheetActionCreateSheetView sheetId={sheetId}/>
      <SheetActionRefreshVisibleRows sheetId={sheetId}/>
      <SheetActionButton
        icon={!isSheetViewLocked ? LOCK_CLOSED : LOCK_OPEN}
        marginLeft="0.375rem"
        marginRight={!isSheetViewLocked ? "0.4125rem" : "0"}
        onClick={() => handleIsFiltersGroupsSortsToggle()}
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
      <SheetActionCreateSheet/>
      <SheetActionUploadCsv/>
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
  border-bottom: 1px solid rgb(180, 180, 180);
`

const Divider = styled.div`
  margin: 0 0.75rem;
  height: 1.5rem;
  width: 1px;
  min-width: 1px;
  background-color: rgb(180, 180, 180)
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
