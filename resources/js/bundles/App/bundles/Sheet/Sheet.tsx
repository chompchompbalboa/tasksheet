//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, useCallback, useEffect, useState } from 'react'
import { areEqual } from 'react-window'
import { batch, connect, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { query } from '@app/api'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  copySheetRange as copySheetRangeAction,
  cutSheetRange as cutSheetRangeAction,
  pasteSheetRange as pasteSheetRangeAction,
  createSheetRow as createSheetRowAction,
  loadSheet as loadSheetAction,
  updateSheet as updateSheetAction,
  updateSheetActive as updateSheetActiveAction,
  updateSheetCell as updateSheetCellAction,
  updateSheetColumn as updateSheetColumnAction,
  updateSheetSelectionFromArrowKey as updateSheetSelectionFromArrowKeyAction,
  updateSheetSelectionFromCellClick as updateSheetSelectionFromCellClickAction,
} from '@app/state/sheet/actions'
import { 
  Sheet, SheetFromServer, SheetUpdates,
  SheetActiveUpdates,
  SheetColumn, IAllSheetColumns, IAllSheetColumnTypes, SheetColumnUpdates, 
  SheetCellUpdates, 
  SheetFilter, SheetFilters, 
  SheetGroup, SheetGroups, 
  SheetRow, IAllSheetRows, 
  SheetSort, SheetSorts 
} from '@app/state/sheet/types'
import {  
  selectColumns, 
  selectColumnTypes,
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
import { selectActiveTab } from '@app/state/tab/selectors'
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
  activeTab: selectActiveTab(state),
  columns: selectColumns(state),
  columnTypes: selectColumnTypes(state),
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
  updateSheetCell: (cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean) => dispatch(updateSheetCellAction(cellId, updates, undoUpdates, skipServerUpdate)),
  updateSheetColumn: (columnId: string, updates: SheetColumnUpdates) => dispatch(updateSheetColumnAction(columnId, updates)),
  updateSheetSelectionFromArrowKey: (sheetId: string, cellId: string, moveDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT') => dispatch(updateSheetSelectionFromArrowKeyAction(sheetId, cellId, moveDirection)),
  updateSheetSelectionFromCellClick: (sheetId: string, cellId: string, isShiftPressed: boolean) => dispatch(updateSheetSelectionFromCellClickAction(sheetId, cellId, isShiftPressed)),
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = memo(({
  activeTab,
  columns,
  columnTypes,
  createSheetRow,
  fileId,
  filters,
  groups,
  id,
  loadSheet,
  rows,
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
  updateSheetSelectionFromArrowKey,
  updateSheetSelectionFromCellClick,
  userColorSecondary
}: SheetComponentProps) => {
  
  const isActiveFile = fileId === activeTab
  const memoizedCreateSheetRow = useCallback((id, sourceSheetId) => createSheetRow(id, sourceSheetId), [])
  const memoizedUpdateSheet = useCallback((sheetId, updates) => updateSheet(sheetId, updates), [])
  const memoizedUpdateSheetActive = useCallback((updates) => updateSheetActive(updates), [])
  const memoizedUpdateSheetCell = useCallback((cellId, updates, undoUpdates, skipServerUpdate) => updateSheetCell(cellId, updates, undoUpdates, skipServerUpdate), [])
  const memoizedUpdateSheetColumn = useCallback((columnId, updates) => updateSheetColumn(columnId, updates), [])
  const memoizedUpdateSheetSelectionFromCellClick = useCallback((cellId, isShiftPressed) => updateSheetSelectionFromCellClick(id, cellId, isShiftPressed), [])
  const memoizedUpdateSheetSelectionFromArrowKey = useCallback((cellId, moveSelectedCellDirection) => updateSheetSelectionFromArrowKey(id, cellId, moveSelectedCellDirection), [])

  const [ hasLoaded, setHasLoaded ] = useState(false)
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      query.getSheet(id).then(sheet => {
        loadSheet(sheet).then(() => {
          setHasLoaded(true)
        })
      })
    }
  }, [ activeTab ])

  const dispatch = useDispatch()
  
  useEffect(() => {
    if(isActiveFile) { 
      addEventListener('cut', handleCut) 
      addEventListener('copy', handleCopy) 
      addEventListener('paste', handlePaste) 
    }
    else {
      removeEventListener('cut', handleCut) 
      removeEventListener('copy', handleCopy) 
      removeEventListener('paste', handlePaste) 
    }
    return () => {
      removeEventListener('cut', handleCut) 
      removeEventListener('copy', handleCopy) 
      removeEventListener('paste', handlePaste) 
    }
  }, [ activeTab ])

  const handleCut = (e: ClipboardEvent) => {
    dispatch(cutSheetRangeAction(id))
  }

  const handleCopy = (e: ClipboardEvent) => {
    dispatch(copySheetRangeAction(id))
  }

  const handlePaste = (e: ClipboardEvent) => {
    dispatch(pasteSheetRangeAction(id))
  }

  const [ isContextMenuVisible, setIsContextMenuVisible ] = useState(false)
  const [ contextMenuType, setContextMenuType ] = useState(null)
  const [ contextMenuId, setContextMenuId ] = useState(null)
  const [ contextMenuIndex, setContextMenuIndex ] = useState(null)
  const [ contextMenuTop, setContextMenuTop ] = useState(null)
  const [ contextMenuLeft, setContextMenuLeft ] = useState(null)
  const [ contextMenuRight, setContextMenuRight ] = useState(null)
  const handleContextMenu = useCallback((e: MouseEvent, type: string, id: string, index?: number) => {
    e.preventDefault()
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    batch(() => {
      setIsContextMenuVisible(true)
      setContextMenuType(type)
      setContextMenuId(id)
      setContextMenuIndex(index)
      setContextMenuTop(e.clientY)
      setContextMenuLeft(e.clientX > (windowWidth * 0.75) ? null : e.clientX)
      setContextMenuRight(e.clientX > (windowWidth * 0.75) ? windowWidth - e.clientX : null)
    })
  }, [])
  const closeContextMenu = () => {
    batch(() => {
      setIsContextMenuVisible(false)
      setContextMenuType(null)
      setContextMenuId(null)
      setContextMenuIndex(null)
      setContextMenuTop(null)
      setContextMenuLeft(null)
      setContextMenuRight(null)
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
          contextMenuIndex={contextMenuIndex}
          contextMenuId={contextMenuId}
          contextMenuTop={contextMenuTop}
          contextMenuLeft={contextMenuLeft}
          contextMenuRight={contextMenuRight}
          closeContextMenu={closeContextMenu}
          sheetVisibleColumns={sheetVisibleColumns}
          updateSheet={memoizedUpdateSheet}
          updateSheetActive={memoizedUpdateSheetActive}
          updateSheetColumn={memoizedUpdateSheetColumn}/>
        <SheetActions
          sheetId={id}
          sourceSheetId={sourceSheetId}
          columns={columns}
          createSheetRow={memoizedCreateSheetRow}
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
              columnTypes={columnTypes}
              handleContextMenu={handleContextMenu}
              highlightColor={userColorSecondary}
              rows={rows}
              sheetId={id}
              updateSheetCell={memoizedUpdateSheetCell}
              sheetVisibleColumns={sheetVisibleColumns}
              sheetVisibleRows={sheetVisibleRows}
              updateSheetActive={memoizedUpdateSheetActive}
              updateSheetColumn={memoizedUpdateSheetColumn}
              updateSheetSelectionFromArrowKey={memoizedUpdateSheetSelectionFromArrowKey}
              updateSheetSelectionFromCellClick={memoizedUpdateSheetSelectionFromCellClick}/>
        }
        </SheetContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetComponentProps {
  activeTab?: string
  columns?: IAllSheetColumns
  columnTypes?: IAllSheetColumnTypes
  createSheetRow?(sheetId: string, sourceSheetId: string): void
  fileId: string
  filters?: SheetFilters
  groups?: SheetGroups
  id: Sheet['id']
  loadSheet?(sheet: SheetFromServer): Promise<void>
  rows?: IAllSheetRows
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
  updateSheetCell?(cellId: string, updates: SheetCellUpdates, undoUpdates?: SheetCellUpdates, skipServerUpdate?: boolean): void
  updateSheetColumn?(columnId: string, updates: SheetColumnUpdates): void
  updateSheetSelectionFromArrowKey?(sheetId: string, cellId: string, moveSelectedCellDirection: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'): void
  updateSheetSelectionFromCellClick?(sheetId: string, cellId: string, isShiftPressed: boolean): void
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
