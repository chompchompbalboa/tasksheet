//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { batch } from 'react-redux'

import { HistoryStep } from '@app/state/history/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'
import { AppState } from '@app/state'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type HistoryActions = UpdateHistory

//-----------------------------------------------------------------------------
// Create History Step
//-----------------------------------------------------------------------------
export const createHistoryStep = (newHistoryStep: HistoryStep): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => AppState) => {
    const {
      undo
    } = getState().history
    dispatch(updateHistory({
      undo: [ newHistoryStep, ...undo ]
    }))
  }
}

//-----------------------------------------------------------------------------
// History Undo
//-----------------------------------------------------------------------------
export const historyUndo = (): ThunkAction => {
  return async (_, getState: () => AppState) => {
    console.log('historyUndo')
    const {
      undo
    } = getState().history
    undo.length > 0 && batch(() => undo[0]())
  }
}

//-----------------------------------------------------------------------------
// Update History
//-----------------------------------------------------------------------------
export const UPDATE_HISTORY = 'UPDATE_HISTORY'
interface UpdateHistory {
  type: typeof UPDATE_HISTORY
  updates: HistoryUpdates
}
interface HistoryUpdates {
  undo?: HistoryStep[]
  redo?: HistoryStep[]
}

export const updateHistory = (updates: HistoryUpdates): HistoryActions => {
	return {
    type: UPDATE_HISTORY,
    updates
	}
}