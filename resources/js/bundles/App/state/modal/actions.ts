//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IModalUpdates } from '@app/state/modal/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IModalActions = IUpdateModal

//-----------------------------------------------------------------------------
// Close Modal
//-----------------------------------------------------------------------------
export const UPDATE_MODAL = 'UPDATE_MODAL'
interface IUpdateModal {
	type: typeof UPDATE_MODAL
  updates: IModalUpdates
}

export const updateModal = (updates: IModalUpdates): IModalActions => {
	return {
		type: UPDATE_MODAL,
		updates
	}
}