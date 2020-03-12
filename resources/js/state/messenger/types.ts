export type IMessengerMessageType = 'ERROR'

export interface IMessengerMessage {
  type: IMessengerMessageType
  message: string
  timeout?: number
}