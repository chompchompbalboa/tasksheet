export type Modal = 'CREATE_SHEET' | 'CREATE_SHEET_FROM_CSV'

export type ModalUpdates = {
  activeModal?: Modal,
  createSheetFolderId?: string
}