//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { IModal } from '@app/state/modal/types'
import { 
  ModalActions, 
  UPDATE_MODAL, 
} from '@app/state/modal/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialModalState: ModalState = {
	activeModal: null,
  createSheetFolderId: null
}
export type ModalState = {
	activeModal: IModal,
  createSheetFolderId: string
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const modalReducer = (state = initialModalState, action: ModalActions): ModalState => {
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
