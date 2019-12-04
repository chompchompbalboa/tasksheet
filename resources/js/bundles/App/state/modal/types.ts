export type IModal = 'CREATE_SHEET_FROM_CSV'

export type IModalUpdates = {
  activeModal?: IModal
  createSheetFolderId?: string
  openSheetAfterCreate?: boolean
}