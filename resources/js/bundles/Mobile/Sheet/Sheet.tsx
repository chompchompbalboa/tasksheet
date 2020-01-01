//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { areEqual } from 'react-window'
import styled from 'styled-components'

import { query } from '@/api'

import { IAppState } from '@/state' 
import { IFile } from '@/state/folder/types'
import { ISheet } from '@/state/sheet/types'

import {
  loadSheet
} from '@/state/sheet/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const MobileSheet = memo(({
  fileId,
  id: sheetId,
}: ISheetProps) => {

  // Redux
  const dispatch = useDispatch()
  const activeTab = useSelector((state: IAppState) => state.tab.activeTab)

  // State
  const [ hasLoaded, setHasLoaded ] = useState(false)

  // Local Variables
  const isActiveFile = fileId === activeTab

  // Effects
  useEffect(() => {
    if(!hasLoaded && isActiveFile) {
      query.getSheet(sheetId).then(sheet => {
        dispatch(loadSheet(sheet))
        setHasLoaded(true)
      })
    }
  }, [ activeTab ])

  return (
    <Container
      data-testid="MobileSheetContainer">
      {fileId} / {sheetId}
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

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default MobileSheet
