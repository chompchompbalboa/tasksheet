//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IHistoryStep } from '@/state/history/types'
import { 
  IHistoryActions,
  UPDATE_HISTORY
} from '@/state/history/actions'

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
export const initialHistoryState: IHistoryState = {
  previousAction: null,
  currentStep: null,
  steps: []
}
export type IHistoryState = {
  previousAction: 'UNDO' | 'REDO',
  currentStep: number,
  steps: IHistoryStep[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialHistoryState, action: IHistoryActions): IHistoryState => {
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
