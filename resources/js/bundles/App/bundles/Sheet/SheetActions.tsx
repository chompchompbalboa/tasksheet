//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import { 
  ISheet
} from '@app/state/sheet/types'

import SheetActionCellStyleBackgroundColor from '@app/bundles/Sheet/SheetActionCellStyleBackgroundColor'
import SheetActionCellStyleBold from '@app/bundles/Sheet/SheetActionCellStyleBold'
import SheetActionCellStyleColor from '@app/bundles/Sheet/SheetActionCellStyleColor'
import SheetActionCellStyleItalic from '@app/bundles/Sheet/SheetActionCellStyleItalic'
import SheetActionCreateRows from '@app/bundles/Sheet/SheetActionCreateRows'
import SheetActionCreateSheetLink from '@/bundles/App/bundles/Sheet/SheetActionCreateSheetLink'
import SheetActionCreateSheetView from '@/bundles/App/bundles/Sheet/SheetActionCreateSheetView'
import SheetActionDownloadCsv from '@app/bundles/Sheet/SheetActionDownloadCsv'
import SheetActionDownloadSheet from '@app/bundles/Sheet/SheetActionDownloadSheet'
import SheetActionFilter from '@app/bundles/Sheet/SheetActionFilter'
import SheetActionGroup from '@app/bundles/Sheet/SheetActionGroup'
import SheetActionRefreshVisibleRows from '@app/bundles/Sheet/SheetActionRefreshVisibleRows'
import SheetActionSort from '@app/bundles/Sheet/SheetActionSort'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  sheetId,
}: ISheetActionsProps) => {
  return (
    <Container>
      <SheetActionFilter sheetId={sheetId}/>
      <SheetActionGroup sheetId={sheetId}/>
      <SheetActionSort sheetId={sheetId}/>
      <SheetActionCreateSheetView sheetId={sheetId}/>
      <SheetActionRefreshVisibleRows sheetId={sheetId}/>
      <SheetActionCreateSheetLink sheetId={sheetId}/>
      <Divider />
      <SheetActionCreateRows sheetId={sheetId}/>
      <Divider />
      <SheetActionCellStyleBold sheetId={sheetId}/>
      <SheetActionCellStyleItalic sheetId={sheetId}/>
      <SheetActionCellStyleBackgroundColor sheetId={sheetId}/>
      <SheetActionCellStyleColor sheetId={sheetId}/>
      <Divider />
      <SheetActionDownloadCsv sheetId={sheetId}/>
      <SheetActionDownloadSheet sheetId={sheetId}/>
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
  align-items: center;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid rgb(180, 180, 180);
`

const Divider = styled.div`
  margin: 0 0.75rem;
  height: 1.5rem;
  width: 1px;
  background-color: rgb(180, 180, 180)
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActions
