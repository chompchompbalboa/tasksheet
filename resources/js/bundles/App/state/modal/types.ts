export type Modal = 'CREATE_SHEET' | 'CREATE_SHEET_FROM_UPLOAD'

export type ModalUpdates = {
  activeModal?: Modal,
  createSheetFolderId?: string
}