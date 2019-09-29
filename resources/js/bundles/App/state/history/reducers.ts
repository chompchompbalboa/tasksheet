//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IHistoryStep } from '@app/state/history/types'
import { 
  HistoryActions,
  UPDATE_HISTORY
} from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
export const initialHistoryState: HistoryState = {
  previousAction: null,
  currentStep: null,
  steps: []
}
export type HistoryState = {
  previousAction: 'UNDO' | 'REDO',
  currentStep: number,
  steps: IHistoryStep[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialHistoryState, action: HistoryActions): HistoryState => {
	switch (action.type) {

    case UPDATE_HISTORY: {
      const { updates } = action
      return { ...state, ...updates}
    }
		default:
			return state
	}
}

export default userReducer
