//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, MouseEvent, useCallback, useEffect, useState } from 'react'
import { areEqual } from 'react-window'
import { batch, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { query } from '@app/api'

import { IAppState } from '@app/state'
import { IFile } from '@app/state/folder/types'
import { 
  copySheetRange,
  cutSheetRange,
  pasteSheetRange,
  loadSheet
} from '@app/state/sheet/actions'
import { 
  ISheet
} from '@app/state/sheet/types'

import LoadingTimer from '@/components/LoadingTimer'
import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetContextMenus from '@app/bundles/Sheet/SheetContextMenus'
import SheetGrid from '@app/bundles/Sheet/SheetGrid'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const Sheet = memo(({
  fileId,
  id: sheetId,
}: ISheetProps) => {

  const dispatch = useDispatch()

  const activeTab = useSelector((state: IAppState) => state.tab.activeTab)

  const isActiveFile = fileId === activeTab

  const [ hasLoaded, setHasLoaded ] = useState(false)
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      query.getSheet(sheetId).then(sheet => {
        dispatch(loadSheet(sheet))
        setHasLoaded(true)
      })
    }
  }, [ activeTab ])
  
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
    dispatch(cutSheetRange(sheetId))
  }

  const handleCopy = (e: ClipboardEvent) => {
    dispatch(copySheetRange(sheetId))
  }

  const handlePaste = (e: ClipboardEvent) => {
    dispatch(pasteSheetRange(sheetId))
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
    <Container
      data-testid="SheetContainer">
      <SheetContainer
        data-testid="SheetContainerContainer">
        <SheetContextMenus
          sheetId={sheetId}
          isContextMenuVisible={isContextMenuVisible}
          contextMenuType={contextMenuType}
          contextMenuIndex={contextMenuIndex}
          contextMenuId={contextMenuId}
          contextMenuTop={contextMenuTop}
          contextMenuLeft={contextMenuLeft}
          contextMenuRight={contextMenuRight}
          closeContextMenu={closeContextMenu}/>
        <SheetActions
          sheetId={sheetId}/>
        {!hasLoaded
          ? isActiveFile ? <LoadingTimer fromId={sheetId}/> : null
          : <SheetGridContainer
              data-testid="SheetGridContainer">
              <SheetGrid
                  sheetId={sheetId}
                  handleContextMenu={handleContextMenu}/>
            </SheetGridContainer>
        }
        </SheetContainer>
    </Container>
  )
}, areEqual)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISheetProps {
  fileId: IFile['id']
  id: ISheet['id']
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
  height: calc(100% - 4.075rem);
`

const SheetGridContainer = styled.div`
  width: 100%;
  height: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default Sheet
