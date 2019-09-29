//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Select Active Modal
//-----------------------------------------------------------------------------
export const selectActiveModal = (state: IAppState): string => state.modal.activeModal

//-----------------------------------------------------------------------------
// Select Modal Create Sheet Folder Id
//-----------------------------------------------------------------------------
export const selectModalCreateSheetFolderId = (state: IAppState): string => state.modal.createSheetFolderId
