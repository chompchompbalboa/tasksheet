export type HistoryStep = {
  actions: (...args: any) => void,
  undoActions: (...args: any) => void
}