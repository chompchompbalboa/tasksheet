//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { IModal } from '@/state/modal/types'
import { 
  IModalActions, 
  UPDATE_MODAL, 
} from '@/state/modal/actions'

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialModalState: IModalState = {
	activeModal: null,
  createSheetFolderId: null,
  openSheetAfterCreate: false
}
export type IModalState = {
	activeModal: IModal,
  createSheetFolderId: string,
  openSheetAfterCreate: boolean
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
