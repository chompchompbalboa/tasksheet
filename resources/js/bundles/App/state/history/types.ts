export type IHistoryStep = {
  actions: (...args: any) => void,
  undoActions: (...args: any) => void
}


export interface IHistoryUpdates {
  previousAction?: 'UNDO' | 'REDO'
  currentStep?: number
  steps?: IHistoryStep[]
}