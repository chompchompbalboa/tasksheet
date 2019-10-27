export type IMessengerMessageKey = 
  'USER_UPDATE_USER_EMAIL_ERROR' |
  'USER_UPDATE_USER_EMAIL_SUCCESS' | 
  'USER_UPDATE_USER_NAME_ERROR' |
  'USER_UPDATE_USER_NAME_SUCCESS' 

export type IMessengerMessageType = 
  'ERROR' |
  'SUCCESS'

export interface IMessengerMessage {
  type: IMessengerMessageType
  message: string
}