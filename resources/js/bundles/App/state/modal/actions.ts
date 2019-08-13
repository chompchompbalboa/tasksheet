//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { ModalUpdates } from '@app/state/modal/types'

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
  updates: ModalUpdates
}

export const updateModal = (updates: ModalUpdates): ModalActions => {
	return {
		type: UPDATE_MODAL,
		updates
	}
}