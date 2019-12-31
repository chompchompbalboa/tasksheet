//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { 
  historyUndo,
  historyRedo
} from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const History = () => {

  // Redux
  const dispatch = useDispatch()

  // Effects
  useEffect(() => {
    addEventListener('keydown', listenForHistoryTriggers)
    return () => removeEventListener('keydown', listenForHistoryTriggers)
  }, [])

  // Respond to Ctrl-Y and Ctrl-Z
  const listenForHistoryTriggers = (e: KeyboardEvent) => {
    const historyTriggers = new Set([ "y", "z"])
    if(historyTriggers.has(e.key) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if(e.key === "z") { dispatch(historyUndo()) }
      if(e.key === "y") { dispatch(historyRedo()) }
    }
  }

  return (
    <Container />
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: none;
`

export default History
