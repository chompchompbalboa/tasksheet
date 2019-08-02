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
import { FileType } from '@app/state/folder/types'
import { 
  createSheetRow as createSheetRowAction,
  loadSheet as loadSheetAction,
  updateSheetCell as updateSheetCellAction
} from '@app/state/sheet/actions'
import { SheetColumns, SheetCellUpdates, SheetFilters, SheetGroups, SheetRows, SheetFromServer, SheetSorts, SheetVisibleColumns, SheetVisibleRows } from '@app/state/sheet/types'
import { 
  selectSheetColumns, 
  selectSheetFilters,
  selectSheetGroups,
  selectSheetRows,
  selectSheetSorts,
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
  columns: selectSheetColumns(state, props.id),
  filters: selectSheetFilters(state, props.id),
  groups: selectSheetGroups(state, props.id),
  rows: selectSheetRows(state, props.id),
  sorts: selectSheetSorts(state, props.id),
  visibleRows: selectSheetVisibleRows(state, props.id),
  visibleColumns: selectSheetVisibleColumns(state, props.id),
  userColorSecondary: selectUserColorSecondary(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  createSheetRow: (sheetId: string) => dispatch(createSheetRowAction(sheetId)),
  loadSheet: (sheet: SheetFromServer) => dispatch(loadSheetAction(sheet)),
  updateSheetCell: (sheetId: string, rowId: string, cellId: string, updates: SheetCellUpdates) => dispatch(updateSheetCellAction(sheetId, rowId, cellId, updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = memo(({
  activeTabId,
  columns,
  createSheetRow,
  fileId,
  fileType,
  filters,
  groups,
  id,
  loadSheet,
  rows,
  sorts,
  visibleRows,
  visibleColumns,
  updateSheetCell,
  userColorSecondary
}: SheetComponentProps) => {
  
  const isActiveFile = fileId === activeTabId

  const [ hasLoaded, setHasLoaded ] = useState(false)
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      const getSheetQuery = fileType === 'SHEET' ? query.getSheet : query.getSheetView
      getSheetQuery(id).then(sheet => {
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
      createSheetRow(id)
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
          isContextMenuVisible={isContextMenuVisible}
          contextMenuType={contextMenuType}
          contextMenuId={contextMenuId}
          contextMenuTop={contextMenuTop}
          contextMenuLeft={contextMenuLeft}
          closeContextMenu={closeContextMenu}/>
        <SheetActions
          sheetId={id}
          columns={columns}
          filters={filters}
          groups={groups}
          sorts={sorts}/>
        {!hasLoaded
          ? isActiveFile ? <LoadingTimer fromId={id}/> : null
          : <SheetGrid
              columns={columns}
              handleContextMenu={handleContextMenu}
              highlightColor={userColorSecondary}
              rows={rows}
              sheetId={id}
              updateSheetCell={updateSheetCell}
              visibleColumns={visibleColumns}
              visibleRows={visibleRows}/>
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
  createSheetRow?(sheetId: string): void
  fileId: string
  fileType: FileType
  filters?: SheetFilters
  groups?: SheetGroups
  id: string
  loadSheet?(sheet: SheetFromServer): Promise<void>
  rows?: SheetRows
  sorts?: SheetSorts
  visibleColumns?: SheetVisibleColumns
  visibleRows?: SheetVisibleRows
  updateSheetCell?(sheetId: string, rowId: string, cellId: string, updates: SheetCellUpdates): void
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
