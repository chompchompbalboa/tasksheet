export type IMessengerMessageType = 
  'MESSAGE' |
  'ERROR'

export interface IMessengerMessage {
  type: IMessengerMessageType
  message: string
}