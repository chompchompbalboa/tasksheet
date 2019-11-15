//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import { HIDDEN, VISIBLE } from '@app/assets/icons'

import { 
  ISheet
} from '@app/state/sheet/types'

import SheetActionButton from '@app/bundles/Sheet/SheetActionButton'
import SheetActionCellStyleBackgroundColor from '@app/bundles/Sheet/SheetActionCellStyleBackgroundColor'
import SheetActionCellStyleBold from '@app/bundles/Sheet/SheetActionCellStyleBold'
import SheetActionCellStyleColor from '@app/bundles/Sheet/SheetActionCellStyleColor'
import SheetActionCellStyleItalic from '@app/bundles/Sheet/SheetActionCellStyleItalic'
import SheetActionCreateRows from '@app/bundles/Sheet/SheetActionCreateRows'
import SheetActionCreateSheetLink from '@/bundles/App/bundles/Sheet/SheetActionCreateSheetLink'
import SheetActionCreateSheetView from '@/bundles/App/bundles/Sheet/SheetActionCreateSheetView'
import SheetActionDownloadCsv from '@app/bundles/Sheet/SheetActionDownloadCsv'
import SheetActionFilter from '@app/bundles/Sheet/SheetActionFilter'
import SheetActionGroup from '@app/bundles/Sheet/SheetActionGroup'
import SheetActionRefreshVisibleRows from '@app/bundles/Sheet/SheetActionRefreshVisibleRows'
import SheetActionSheetCellPriorities from '@app/bundles/Sheet/SheetActionSheetCellPriorities'
import SheetActionSort from '@app/bundles/Sheet/SheetActionSort'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActions = ({
  sheetId,
}: ISheetActionsProps) => {

  const localStorageKey = 'tracksheet.SheetActions.isFiltersGroupsSortVisible'

  const [ isFiltersSortsGroupsVisible, setIsFiltersGroupsSortsVisible ] = useState(localStorage.getItem(localStorageKey) !== null && localStorage.getItem(localStorageKey) === 'true')

  const handleIsFiltersGroupsSortsToggle = () => {
    localStorage.setItem(localStorageKey, !isFiltersSortsGroupsVisible + '')
    setIsFiltersGroupsSortsVisible(!isFiltersSortsGroupsVisible)
  }

  return (
    <Container>
      <SheetActionCreateSheetView sheetId={sheetId}/>
      <SheetActionRefreshVisibleRows sheetId={sheetId}/>
      <SheetActionButton
        icon={isFiltersSortsGroupsVisible ? HIDDEN : VISIBLE}
        marginLeft="0.375rem"
        marginRight={isFiltersSortsGroupsVisible ? "0.4125rem" : "0"}
        onClick={() => handleIsFiltersGroupsSortsToggle()}/>
      {isFiltersSortsGroupsVisible &&
        <>
          <SheetActionFilter sheetId={sheetId}/>
          <SheetActionGroup sheetId={sheetId}/>
          <SheetActionSort sheetId={sheetId}/>
        </>
      }
      <Divider />
      <SheetActionCreateRows sheetId={sheetId}/>
      <Divider />
      <SheetActionCellStyleBold sheetId={sheetId}/>
      <SheetActionCellStyleItalic sheetId={sheetId}/>
      <SheetActionCellStyleBackgroundColor sheetId={sheetId}/>
      <SheetActionCellStyleColor sheetId={sheetId}/>
      <Divider />
      <SheetActionSheetCellPriorities sheetId={sheetId}/>
      <Divider />
      <SheetActionCreateSheetLink sheetId={sheetId}/>
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
