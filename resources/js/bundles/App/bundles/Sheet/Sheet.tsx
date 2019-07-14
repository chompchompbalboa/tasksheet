//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { query } from '@app/api'

import { AppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { loadSheet as loadSheetAction } from '@app/state/sheet/actions'
import { NestedSheet } from '@app/state/sheet/types'
import { selectActiveTabId } from '@app/state/tab/selectors'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  activeTabId: selectActiveTabId(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  loadSheet: (sheet: NestedSheet) => dispatch(loadSheetAction(sheet))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetComponent = ({
  activeTabId,
  fileId,
  id,
  loadSheet
}: SheetProps) => {

  const [ hasLoaded, setHasLoaded ] = useState(false)

  useEffect(() => {
    if(!hasLoaded && fileId === activeTabId) {
      query.getSheet(id).then(sheet => {
        loadSheet(sheet).then(() => {
          setHasLoaded(true)
        })
      })
    }
  }, [ activeTabId ])

  return (
    <Container>
      {!hasLoaded 
        ? 'Loading...'
        : <SheetContainer>
            <Sheet>
              <tbody><tr><td>{id}</td></tr></tbody>
            </Sheet>
          </SheetContainer>
        }
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetProps {
  activeTabId: string
  fileId: string
  id: string
  loadSheet?(sheet: NestedSheet): Promise<void>
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: scroll;
`

const SheetContainer = styled.div`
  width: 100%;
  z-index: 5;
`

const Sheet = styled.table`
  width: 100%;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetComponent)
