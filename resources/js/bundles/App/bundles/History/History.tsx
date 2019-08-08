//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { ThunkDispatch } from '@app/state/types'
import { 
  historyUndo as historyUndoAction,
  historyRedo as historyRedoAction
} from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  historyUndo: () => dispatch(historyUndoAction()),
  historyRedo: () => dispatch(historyRedoAction())
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Settings = ({
  historyUndo,
  historyRedo
}: SettingsProps) => {

  useEffect(() => {
    addEventListener('keydown', listenForHistoryTriggers)
    addEventListener('keydown', listenForHistoryTriggers)
    return () => removeEventListener('keydown', listenForHistoryTriggers)
  }, [])

  const listenForHistoryTriggers = (e: KeyboardEvent) => {
    const historyTriggers = new Set([ "y", "z"])
    if(historyTriggers.has(e.key) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if(e.key === "z") { historyUndo() }
      if(e.key === "y") { historyRedo() }
    }
  }

  return (
    <Container />
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface SettingsProps {
  historyUndo?(): void
  historyRedo?(): void
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: none;
`

export default connect(
  null,
  mapDispatchToProps
)(Settings)
