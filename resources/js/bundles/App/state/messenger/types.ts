export type IMessengerMessageKey = 
  'ORGANIZATION_UPDATE_ORGANIZATION_NAME_ERROR' |
  'USER_UPDATE_USER_EMAIL_ERROR' |
  'USER_UPDATE_USER_NAME_ERROR'

export type IMessengerMessageType = 
  'ERROR' |
  'SUCCESS'

export interface IMessengerMessage {
  type: IMessengerMessageType
  message: string
}