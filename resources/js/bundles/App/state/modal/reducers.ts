//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { IModal } from '@app/state/modal/types'
import { 
  IModalActions, 
  UPDATE_MODAL, 
} from '@app/state/modal/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialModalState: IModalState = {
	activeModal: null,
  createSheetFolderId: null
}
export type IModalState = {
	activeModal: IModal,
  createSheetFolderId: string
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const modalReducer = (state = initialModalState, action: IModalActions): IModalState => {
	switch (action.type) {

		case UPDATE_MODAL: {
			const { updates } = action
			return { ...state, ...updates }
		}

		default:
			return state
	}
}

export default modalReducer
