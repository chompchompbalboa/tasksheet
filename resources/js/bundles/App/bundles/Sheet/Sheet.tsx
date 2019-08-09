//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, useCallback, useEffect, useState } from 'react'
import { areEqual } from 'react-window'
import { batch, connect } from 'react-redux'
import styled from 'styled-components'

import { query } from '@app/api'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  createSheetRow as createSheetRowAction,
  loadSheet as loadSheetAction,
  updateSheet as updateSheetAction,
  updateSheetActive as updateSheetActiveAction,
  updateSheetCell as updateSheetCellAction,
  updateSheetColumn as updateSheetColumnAction
} from '@app/state/sheet/actions'
import { 
  Sheet, SheetFromServer, SheetUpdates,
  SheetActiveUpdates,
  SheetColumn, SheetColumns, SheetColumnUpdates, 
  SheetCellUpdates, 
  SheetFilter, SheetFilters, 
  SheetGroup, SheetGroups, 
  SheetRow, SheetRows, 
  SheetSort, SheetSorts 
} from '@app/state/sheet/types'
import {  
  selectColumns, 
  selectFilters,
  selectGroups,
  selectRows,
  selectSorts,
  selectSheetColumns,
  selectSheetFilters,
  selectSheetGroups,
  selectSheetSorts,
  selectSheetSourceSheetId,
  selectSheetVisibleColumns,
  selectSheetVisibleRows
} from '@app/state/sheet/selectors'
import { selectActiveTabId } from '@app/state/tab/selectors'
import { 
  selectUserColorSecondary
} from '@app/state/user/selectors'

import LoadingTimer from '@/components/LoadingTimer'
import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetContextMenus from '@app/bundles/Sheet/SheetContextMenus'
import SheetGrid from '@app/bundles/Sheet/SheetGrid'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetComponentProps) => ({
  activeTabId: selectActiveTabId(state),
  columns: selectColumns(state),
  filters: selectFilters(state),
  groups: selectGroups(state),
  rows: selectRows(state),
  sorts: selectSorts(state),
  sheetColumns: selectSheetColumns(state, props.id),
  sheetFilters: selectSheetFilters(state, props.id),
  sheetGroups: selectSheetGroups(state, props.id),
  sheetSorts: selectSheetSorts(state, props. id),
  sheetVisibleRows: selectSheetVisibleRows(state, props.id),
  sheetVisibleColumns: selectSheetVisibleColumns(state, props.id),
  sourceSheetId: selectSheetSourceSheetId(state, props.id),
  userColorSecondary: selectUserColorSecondary(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  createSheetRow: (sheetId: string, sourceSheetId: string) => dispatch(createSheetRowAction(sheetId, sourceSheetId)),
  loadSheet: (sheet: SheetFromServer) => dispatch(loadSheetAction(sheet)),
  updateSheet: (sheetId: string, updates: SheetUpdates) => dispatch(updateSheetAction(sheetId, updates)),
  updateSheetActive: (updates: SheetActiveUpdates) => dispatch(updateSheetActiveAction(updates)),
  updateSheetCell: (cellId: string, updates: SheetCellUpdates, undoUpdates: SheetCellUpdates) => dispatch(updateSheetCellAction(cellId, updates, undoUpdates)),
  updateSheetColumn: (columnId: string, updates: SheetColumnUpdates) => dispatch(updateSheetColumnAction(columnId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = memo(({
  activeTabId,
  columns,
  createSheetRow,
  fileId,
  filters,
  groups,
  id,
  loadSheet,
  rows,
  sheetColumns,
  sheetFilters,
  sheetGroups,
  sheetSorts,
  sheetVisibleRows,
  sheetVisibleColumns,
  sorts,
  sourceSheetId,
  updateSheet,
  updateSheetActive,
  updateSheetCell,
  updateSheetColumn,
  userColorSecondary
}: SheetComponentProps) => {
  
  const isActiveFile = fileId === activeTabId
  const memoizedUpdateSheet = useCallback((sheetId, updates) => updateSheet(sheetId, updates), [])
  const memoizedUpdateSheetActive = useCallback((updates) => updateSheetActive(updates), [])
  const memoizedUpdateSheetCell = useCallback((cellId, updates, undoUpdates) => updateSheetCell(cellId, updates, undoUpdates), [])
  const memoizedUpdateSheetColumn = useCallback((columnId, updates) => updateSheetColumn(columnId, updates), [])

  const [ hasLoaded, setHasLoaded ] = useState(false)
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      query.getSheet(id).then(sheet => {
        loadSheet(sheet).then(() => {
          setHasLoaded(true)
        })
      })
    }
  }, [ activeTabId ])

  useEffect(() => {
    if(hasLoaded && isActiveFile) { 
      addEventListener('keypress', listenForPlusSignPress)
    }
    else { 
      removeEventListener('keypress', listenForPlusSignPress) 
    }
    return () => {
      removeEventListener('keypress', listenForPlusSignPress)
    }
  }, [ hasLoaded, isActiveFile ])

  const listenForPlusSignPress = (e: KeyboardEvent) => {
    if(e.key === "+") {
      createSheetRow(id, sourceSheetId)
    }
  }

  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuType, setContextMenuType ] = useState(null)
  const [ contextMenuId, setContextMenuId ] = useState(null)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const handleContextMenu = useCallback((e: MouseEvent, type: string, id: string) => {
    e.preventDefault()
    batch(() => {
      setIsContextMenuVisible(true)
      setContextMenuType(type)
      setContextMenuId(id)
      setContextMenuTop(e.clientY)
      setContextMenuLeft(e.clientX)
    })
  }, [])
  const closeContextMenu = () => {
    batch(() => {
      setIsContextMenuVisible(false)
      setContextMenuType(null)
      setContextMenuId(null)
      setContextMenuTop(null)
      setContextMenuLeft(null)
    })
  }

  return (
    <Container>
      <SheetContainer>
        <SheetContextMenus
          sheetId={id}
          isContextMenuVisible={isContextMenuVisible}
          columns={columns}
          contextMenuType={contextMenuType}
          contextMenuId={contextMenuId}
          contextMenuTop={contextMenuTop}
          contextMenuLeft={contextMenuLeft}
          closeContextMenu={closeContextMenu}
          sheetVisibleColumns={sheetVisibleColumns}
          updateSheet={memoizedUpdateSheet}
          updateSheetActive={memoizedUpdateSheetActive}
          updateSheetColumn={memoizedUpdateSheetColumn}/>
        <SheetActions
          sheetId={id}
          columns={columns}
          filters={filters}
          groups={groups}
          sheetFilters={sheetFilters}
          sheetGroups={sheetGroups}
          sheetSorts={sheetSorts}
          sheetVisibleColumns={sheetVisibleColumns}
          sorts={sorts}/>
        {!hasLoaded
          ? isActiveFile ? <LoadingTimer fromId={id}/> : null
          : <SheetGrid
              columns={columns}
              handleContextMenu={handleContextMenu}
              highlightColor={userColorSecondary}
              rows={rows}
              sheetId={id}
              updateSheetCell={memoizedUpdateSheetCell}
              sheetVisibleColumns={sheetVisibleColumns}
              sheetVisibleRows={sheetVisibleRows}
              updateSheetActive={memoizedUpdateSheetActive}
              updateSheetColumn={memoizedUpdateSheetColumn}/>
        }
        </SheetContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetComponentProps {
  activeTabId?: string
  columns?: SheetColumns
  createSheetRow?(sheetId: string, sourceSheetId: string): void
  fileId: string
  filters?: SheetFilters
  groups?: SheetGroups
  id: Sheet['id']
  loadSheet?(sheet: SheetFromServer): Promise<void>
  rows?: SheetRows
  sheetColumns?: SheetColumn['id'][]
  sheetFilters?: SheetFilter['id'][]
  sheetGroups?: SheetGroup['id'][]
  sheetSorts?: SheetSort['id'][]
  sheetVisibleColumns?: SheetColumn['id'][]
  sheetVisibleRows?: SheetRow['id'][]
  sorts?: SheetSorts
  sourceSheetId?: string
  updateSheet?(sheetId: string, updates: SheetUpdates): void
  updateSheetActive?(updates: SheetActiveUpdates): void
  updateSheetCell?(cellId: string, updates: SheetCellUpdates, undoUpdates: SheetCellUpdates): void
  updateSheetColumn?(columnId: string, updates: SheetColumnUpdates): void
  userColorSecondary?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const SheetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  height: calc(100% - 4.075rem);
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetComponent)
