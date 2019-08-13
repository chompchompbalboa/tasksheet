//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { AppState } from '@app/state'

//-----------------------------------------------------------------------------
// Select Active Modal
//-----------------------------------------------------------------------------
export const selectActiveModal = (state: AppState): string => state.modal.activeModal

//-----------------------------------------------------------------------------
// Select Modal Create Sheet Folder Id
//-----------------------------------------------------------------------------
export const selectModalCreateSheetFolderId = (state: AppState): string => state.modal.createSheetFolderId
