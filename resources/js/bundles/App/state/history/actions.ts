//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IHistoryStep } from '@app/state/history/types'
import { ThunkAction, ThunkDispatch } from '@app/state/types'
import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type HistoryActions = UpdateHistory

//-----------------------------------------------------------------------------
// Create History Step
//-----------------------------------------------------------------------------
export const createHistoryStep = (newHistoryStep: IHistoryStep): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => IAppState) => {
    const {
      currentStep,
      steps
    } = getState().history
    const nextSteps = currentStep !== (steps.length - 1) ? steps.slice(0, currentStep + 1) : steps
    dispatch(updateHistory({
      currentStep: currentStep === null ? 0 : currentStep + 1,
      steps: [ ...nextSteps, newHistoryStep ]
    }))
  }
}

//-----------------------------------------------------------------------------
// History Undo
//-----------------------------------------------------------------------------
export const historyUndo = (): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => IAppState) => {
    const {
      currentStep,
      steps
    } = getState().history
    if(steps && steps[currentStep]) {
      steps[currentStep].undoActions()
      dispatch(updateHistory({
        previousAction: 'UNDO',
        currentStep: currentStep === -1 ? -1 : currentStep - 1
      }))
    }
  }
}

//-----------------------------------------------------------------------------
// History Redo
//-----------------------------------------------------------------------------
export const historyRedo = (): ThunkAction => {
  return async (dispatch: ThunkDispatch, getState: () => IAppState) => {
    const {
      currentStep,
      steps
    } = getState().history
    if(steps && steps[currentStep + 1]) {
      steps[currentStep + 1].actions()
      dispatch(updateHistory({
        previousAction: 'REDO',
        currentStep: currentStep === (steps.length - 1) ? currentStep : currentStep + 1
      }))
    }
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
  previousAction?: 'UNDO' | 'REDO'
  currentStep?: number
  steps?: IHistoryStep[]
}

export const updateHistory = (updates: HistoryUpdates): HistoryActions => {
	return {
    type: UPDATE_HISTORY,
    updates
	}
}