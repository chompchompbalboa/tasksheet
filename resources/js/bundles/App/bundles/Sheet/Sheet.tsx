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
import { selectSheetWidth } from '@app/state/sheet/selectors'
import { selectActiveTabId } from '@app/state/tab/selectors'

import SheetActions from '@app/bundles/Sheet/SheetActions'
import SheetColumns from '@app/bundles/Sheet/SheetColumns'
import SheetRows from '@app/bundles/Sheet/SheetRows'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState, props: SheetComponentProps) => ({
  activeTabId: selectActiveTabId(state),
  sheetWidth: selectSheetWidth(state, props.id)
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
  loadSheet,
  sheetWidth
}: SheetComponentProps) => {

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
      <SheetContainer
        sheetWidth={sheetWidth}>
        <SheetActions />
        {!hasLoaded 
          ? 'Loading...'
          : <Sheet>
              <SheetColumns sheetId={id}/>
              <SheetRows sheetId={id}/>
            </Sheet>
        }
        </SheetContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SheetComponentProps {
  activeTabId?: string
  fileId: string
  id: string
  loadSheet?(sheet: NestedSheet): Promise<void>
  sheetWidth?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: scroll;
`

const SheetContainer = styled.div`
  position: relative;
  width: ${ ({ sheetWidth }: SheetContainerProps) => sheetWidth};
`
interface SheetContainerProps {
  sheetWidth: string
}

const Sheet = styled.table`
  position: relative;
  width: 100%;
  border-collapse: collapse;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetComponent)
