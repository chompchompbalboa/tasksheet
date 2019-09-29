//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IModalUpdates } from '@app/state/modal/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type ModalActions = UpdateModal

//-----------------------------------------------------------------------------
// Close Modal
//-----------------------------------------------------------------------------
export const UPDATE_MODAL = 'UPDATE_MODAL'
interface UpdateModal {
	type: typeof UPDATE_MODAL
  updates: IModalUpdates
}

export const updateModal = (updates: IModalUpdates): ModalActions => {
	return {
		type: UPDATE_MODAL,
		updates
	}
}