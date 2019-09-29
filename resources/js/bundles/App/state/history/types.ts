export type IHistoryStep = {
  actions: (...args: any) => void,
  undoActions: (...args: any) => void
}