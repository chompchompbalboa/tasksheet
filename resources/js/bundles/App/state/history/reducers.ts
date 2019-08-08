//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { HistoryStep } from '@app/state/history/types'
import { 
  HistoryActions,
  UPDATE_HISTORY
} from '@app/state/history/actions'

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
export const initialHistoryState: HistoryState = {
  undo: [],
  redo: []
}
export type HistoryState = {
  undo: HistoryStep[]
	redo: HistoryStep[]
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
