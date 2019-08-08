//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { ThunkDispatch } from '@app/state/types'
import { historyUndo as historyUndoAction } from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  historyUndo: () => dispatch(historyUndoAction())
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const Settings = ({
  historyUndo
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
      if(e.key === "z") { historyUndo()}
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
