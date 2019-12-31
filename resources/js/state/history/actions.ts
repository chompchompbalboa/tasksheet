//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IThunkAction, IThunkDispatch } from '@/state/types'
import { IAppState } from '@/state'
import { IHistoryStep, IHistoryUpdates } from '@/state/history/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IHistoryActions = IUpdateHistory

//-----------------------------------------------------------------------------
// Create History Step
//-----------------------------------------------------------------------------
export const createHistoryStep = (newHistoryStep: IHistoryStep): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
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
export const historyUndo = (): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      currentStep,
      steps
    } = getState().history
    if(steps && steps[currentStep]) {
      steps[currentStep].undoActions(true)
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
export const historyRedo = (): IThunkAction => {
  return async (dispatch: IThunkDispatch, getState: () => IAppState) => {
    const {
      currentStep,
      steps
    } = getState().history
    if(steps && steps[currentStep + 1]) {
      steps[currentStep + 1].actions(true)
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
interface IUpdateHistory {
  type: typeof UPDATE_HISTORY
  updates: IHistoryUpdates
}

export const updateHistory = (updates: IHistoryUpdates): IHistoryActions => {
	return {
    type: UPDATE_HISTORY,
    updates
	}
}