export type IHistoryStep = {
  actions: (isHistoryAction?: boolean) => void,
  undoActions: (isHistoryAction?: boolean) => void
}


export interface IHistoryUpdates {
  previousAction?: 'UNDO' | 'REDO'
  currentStep?: number
  steps?: IHistoryStep[]
}